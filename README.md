# Retail Pulse

---

Retail Pulse is a backend service designed to process thousands of images collected from retail stores. It calculates the perimeter of each image and tracks job statuses using PostgreSQL, Redis, and Docker.

---

## Features

- **Submit Jobs**: Submit jobs with image URLs and store IDs.
- **Image Processing**: Calculate the perimeter of each image (`2 * (width + height)`).
- **Job Tracking**: Track job status (ongoing, completed, failed).
- **Store Validation**: Validate store IDs against a `StoreMaster.csv` file.
- **Dockerized**: Easy deployment using Docker and Docker Compose.

---

## Technologies Used

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL
- **Caching**: Redis
- **Image Processing**: Sharp
- **Containerization**: Docker, Docker Compose
- **API Documentation**: OpenAPI (Swagger)

---

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.
- Node.js (v18 or higher) for local development.

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/retail_pulse.git
   cd retail_pulse
