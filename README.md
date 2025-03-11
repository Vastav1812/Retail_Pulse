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
- **API Documentation**: OpenAPI (DEEPSEEK) --BONUS IMPLEMENTATION

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

# Store Visit Image Processing API

## Overview
This API enables users to submit and process images collected during store visits. The system handles image processing jobs asynchronously and provides status updates on job completion.

## API Endpoints

### 1. Submit Job
Creates a new image processing job for store visit images.

**URL:** `/api/submit/`  
**Method:** `POST`  
**Content-Type:** `application/json`

#### Request Payload
```json
{
   "count": 2,
   "visits": [
      {
         "store_id": "S00339218",
         "image_url": [
            "https://www.gstatic.com/webp/gallery/2.jpg",
            "https://www.gstatic.com/webp/gallery/3.jpg"
         ],
         "visit_time": "time of store visit"
      },
      {
         "store_id": "S01408764",
         "image_url": [
            "https://www.gstatic.com/webp/gallery/3.jpg"
         ],
         "visit_time": "time of store visit"
      }
   ]
}
```

#### Parameters
| Field | Type | Description |
|-------|------|-------------|
| count | Integer | Number of store visits in the request |
| visits | Array | List of store visits with their details |
| store_id | String | Unique identifier for the store |
| image_url | Array | List of image URLs collected during the visit |
| visit_time | String | Timestamp of when the store was visited |

#### Success Response
- **Code:** 201 CREATED
- **Content:**
```json
{
    "job_id": 123
}
```

#### Error Response
- **Condition:** If fields are missing OR count doesn't match the length of visits
- **Code:** 400 BAD REQUEST
- **Content:**
```json
{
    "error": "Invalid request format or count mismatch"
}
```

### 2. Get Job Info
Retrieves the status of a previously submitted job.

**URL:** `/api/status`  
**Method:** `GET`  
**URL Parameters:** `jobid=[integer]` (Job ID received when creating the job)

#### Success Responses
- **Job Status: Completed**
  - **Code:** 200 OK
  - **Content:**
  ```json
  {
      "status": "completed",
      "job_id": "123"
  }
  ```

- **Job Status: Failed**
  - **Code:** 200 OK
  - **Content:**
  ```json
  {
      "status": "failed",
      "job_id": "123",
      "error": [
          {
              "store_id": "S00339218",
              "error": "Store ID not found or image download failed"
          }
      ]
  }
  ```

#### Error Response
- **Condition:** If jobID does not exist
- **Code:** 400 BAD REQUEST
- **Content:**
```json
{}
```

## System Architecture

![System Architecture Diagram](placeholder_for_architecture_diagram.png)

The system consists of:
- API Gateway: Handles incoming requests and routes them to appropriate services
- Job Queue: Manages processing jobs in an asynchronous manner
- Image Processor: Downloads and processes images from provided URLs
- Store Database: Validates store IDs and manages store information
- Status Tracker: Monitors and reports on job status

## Usage Examples

### Example: Submitting a Job
```bash
curl -X POST -H "Content-Type: application/json" -d '{
   "count": 1,
   "visits": [
      {
         "store_id": "S00339218",
         "image_url": [
            "https://www.gstatic.com/webp/gallery/2.jpg"
         ],
         "visit_time": "2025-03-11T10:00:00Z"
      }
   ]
}' https://api.example.com/api/submit/
```

### Example: Checking Job Status
```bash
curl -X GET https://api.example.com/api/status?jobid=123
```

## Error Handling
The API uses standard HTTP status codes and returns detailed error messages to help troubleshoot issues:
- 400: Bad Request (invalid input, missing fields)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (server-side issue)

## Rate Limiting
To ensure service stability, API requests are limited to:
- 100 requests per minute per API key
- Maximum of 500 images per job submission

## Authentication
API access requires authentication using API keys. Contact your system administrator to obtain credentials.
