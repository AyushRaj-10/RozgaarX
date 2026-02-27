CREATE TABLE applications (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,

    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'applied' 
    CHECK (status IN ('applied','shortlisted','rejected','accepted'))

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_application
        UNIQUE(user_id, job_id)
);