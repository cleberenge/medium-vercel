-- Create posts table for the blog
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on published for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

