CREATE TABLE jobs (
                      job_id SERIAL PRIMARY KEY,
                      status VARCHAR(20) NOT NULL DEFAULT 'pending',
                      summary TEXT,
                      created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE job_images (
                            image_id SERIAL PRIMARY KEY,
                            job_id INT REFERENCES jobs(job_id),
                            store_id VARCHAR(20) NOT NULL,
                            image_url TEXT NOT NULL,
                            perimeter FLOAT NOT NULL
);

CREATE TABLE job_errors (
                            error_id SERIAL PRIMARY KEY,
                            job_id INT REFERENCES jobs(job_id),
                            store_id VARCHAR(20) NOT NULL,
                            error TEXT NOT NULL
);