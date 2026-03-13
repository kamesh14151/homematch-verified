ALTER TABLE public.properties
ADD COLUMN security_deposit_amount INTEGER,
ADD COLUMN booking_hold_amount INTEGER;

COMMENT ON COLUMN public.properties.security_deposit_amount IS 'Landlord-defined security deposit amount for the property.';
COMMENT ON COLUMN public.properties.booking_hold_amount IS 'Landlord-defined booking hold amount requested during booking flow.';