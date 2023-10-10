# Receipts App

A financial React/Django/REST app for tracking expenses. Right now, it has the core functionality to CRUD the receipts, login, and DB sync. In a future update, planning to add OCR for automatic receipt scanning and parsing. Check out live demo [here](https://artman.pythonanywhere.com/receiptapp/login?portfolio=true).

## Features

- CRUD the receipts.
- Receipts categorization.
- User login/register.
- Statistics.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Arden27/receipts.git
    ```
2. Navigate to the project directory:
    ```bash
    cd receipts
    ```
3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
5. Install the required packages:
    ```bash
    npm install
    ```
6. Create React build:
    ```bash
    npm run build
    ```
7. The React app will be served y Django:
    ```bash
    cd ..
    python manage.py runserver
    ```
8. Open your web browser and navigate to [http://127.0.0.1:8000/](http://127.0.0.1:8000/) to use the application.

## Contributing

Feel free to fork this repository, create a new feature branch, and send us a pull request. For bugs and feature requests, please create an issue.

## License

MIT License. See `LICENSE` for more information.
