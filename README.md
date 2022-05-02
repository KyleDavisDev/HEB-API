# HEB-API
Repo created for interview purposes w/ H-E-B.

To run the application, first run ``npm install`` to download all npm packages and then run ``npm run start`` to start the server. Additionally, you will need to have the ``variables.env`` file in the root of your project for the expected connections to work.

## Overview
Build a HTTP REST API in {**Java**|**Node.js**|**Python**} for a service that ingests user images, analyzes them for object detection, and returns the enhanced content. It should implement the following specification::

API Specification

GET */images*
>• Returns HTTP 200 OK with a JSON response containing all image metadata.

GET */images?objects="dog,cat"*
>• Returns a HTTP 200 OK with a JSON response body containing only images that have
the detected objects specified in the query parameter.

GET */images/{imageId}*
>• Returns HTTP 200 OK with a JSON response containing image metadata for the specified image.

POST */images*
>• Send a JSON request body including an image file or URL, an optional label for the image, and an optional field to enable object detection.
>
>• Returns a HTTP 200 OK with a JSON response body including the image data, its label (generate one if the user did not provide it), its identifier provided by the persistent data store, and any objects detected (if object detection was enabled).

## Expectations
No frontend is required, but you may create one to demo the API. Regardless, a user of the API should be able to:

• Upload an optionally labelled image and run image object detection on it.

• Retrieve all images and any metadata obtained from their analyses.

• Search for images based on detected objects
