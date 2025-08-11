-- Desabilita Row Level Security na tabela create_posts_table
-- Isso permite operações de INSERT, UPDATE e DELETE sem políticas específicas

ALTER TABLE create_posts_table DISABLE ROW LEVEL SECURITY;
