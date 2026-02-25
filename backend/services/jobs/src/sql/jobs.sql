CREATE TABLE jobs (

    id SERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    description TEXT NOT NULL,

    company VARCHAR(255) NOT NULL,

    location VARCHAR(255),

    salary_min INTEGER,

    salary_max INTEGER,

    job_type VARCHAR(50),

    experience_level VARCHAR(50),

    skills TEXT[],

    created_by INTEGER NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW()

);