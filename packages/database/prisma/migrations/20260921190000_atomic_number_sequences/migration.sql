-- Add the journal allocator to the shared, transaction-safe number sequence table.
ALTER TYPE "NumberSequenceType" ADD VALUE IF NOT EXISTS 'JOURNAL';
