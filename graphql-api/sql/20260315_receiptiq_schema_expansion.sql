ALTER TABLE public.receipts
  ADD COLUMN IF NOT EXISTS raw_text text,
  ADD COLUMN IF NOT EXISTS flagged_reason text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'receipts_flagged_reason_check'
  ) THEN
    ALTER TABLE public.receipts
      ADD CONSTRAINT receipts_flagged_reason_check CHECK (
        flagged_reason IS NULL OR flagged_reason = ANY (
          ARRAY[
            'duplicate',
            'personal_purchase',
            'above_policy',
            'no_cnpj',
            'parse_failed'
          ]
        )
      );
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'receipt_items'
      AND column_name = 'description'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'receipt_items'
      AND column_name = 'normalized_description'
  ) THEN
    ALTER TABLE public.receipt_items
      RENAME COLUMN description TO normalized_description;
  END IF;
END $$;

ALTER TABLE public.receipt_items
  ADD COLUMN IF NOT EXISTS raw_description text;

UPDATE public.receipt_items
SET raw_description = normalized_description
WHERE raw_description IS NULL;

ALTER TABLE public.receipt_items
  ALTER COLUMN raw_description SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.spend_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (
    category = ANY (ARRAY['food', 'fuel', 'office-supplies', 'cleaning', 'other'])
  ),
  max_per_transaction numeric(10, 2),
  max_per_month numeric(10, 2),
  created_at timestamptz DEFAULT now(),
  UNIQUE (company_id, category)
);

CREATE INDEX IF NOT EXISTS idx_spend_policies_company
  ON public.spend_policies (company_id);

INSERT INTO public.spend_policies (
  company_id,
  category,
  max_per_transaction,
  max_per_month
)
SELECT
  category_spend_limits.company_id,
  category_spend_limits.category,
  category_spend_limits.max_receipt_amount,
  NULL
FROM public.category_spend_limits
ON CONFLICT (company_id, category) DO UPDATE
SET max_per_transaction = EXCLUDED.max_per_transaction;

INSERT INTO public.spend_policies (
  company_id,
  category,
  max_per_transaction,
  max_per_month
)
SELECT
  companies.id,
  defaults.category,
  defaults.max_per_transaction,
  NULL
FROM public.companies
CROSS JOIN (
  VALUES
    ('food', 50.00::numeric),
    ('fuel', 150.00::numeric),
    ('office-supplies', 120.00::numeric),
    ('cleaning', 90.00::numeric),
    ('other', 75.00::numeric)
) AS defaults(category, max_per_transaction)
ON CONFLICT (company_id, category) DO NOTHING;
