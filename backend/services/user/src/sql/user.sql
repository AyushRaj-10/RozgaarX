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