CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    auth_id INT NOT NULL REFERENCES auth(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',        
    resume_url VARCHAR(255),
    skills TEXT,                             
    experience_years INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Track user actions (applied jobs, etc.)
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(50),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update experience type
ALTER TABLE users 
ALTER COLUMN experience_years TYPE VARCHAR(20);

-- Add new columns
ALTER TABLE users
ADD COLUMN current_company VARCHAR(100),
ADD COLUMN bio TEXT,
ADD COLUMN location VARCHAR(100),
ADD COLUMN work_type VARCHAR(20),
ADD COLUMN salary_min INT,
ADD COLUMN salary_max INT,
ADD COLUMN open_to_roles TEXT[],
ADD COLUMN notice_period VARCHAR(20),
ADD COLUMN linkedin VARCHAR(255),
ADD COLUMN portfolio VARCHAR(255);

-- Improve skills column
ALTER TABLE users
ALTER COLUMN skills TYPE TEXT[] USING string_to_array(skills, ',');