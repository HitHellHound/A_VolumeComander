# AVolumeCommander 🧭
Web file manager for Docker Volumes

![AVCLogo](./frontend/public/logo512x182.png)

## ✨Features

- **Simple file manager functionality**: Use the usual file manager operations with Dokcer Volumes  
- **Two directory interface**: Open two different directories and use the **drag and drop** function to move the file from one to the other
- **Asynchronous processing**: Don't freeze work with files while some are being processed

## 🐳Use as Docker Container

You can use already built application container

1. Pull docker image from Docker Hub:

    ```bash
    docker pull avolumecommander
    ```

2. Replace `your_volume` with name of volume you want to manage in command above and run docker container:

    ```bash
    docker run -p 8080:8080 -d --rm -v your_volume:/volume --name avc avolumecommander
    ```

3. Open `localhost:8080` in browser

## ⚙️Run project on your system

Java version 17+ must be installed on your system to run the project

1. Clone repository

    ```bash
    git clone https://github.com/HitHellHound/A_VolumeComander.git
    ```

2. Open cloned project and go to _backend_ directory

    ```bash
    cd backend
    ```

3. Run application with _gradle wrapper_

    ```bash
    ./gradlew bootRun
    ```

> [!NOTE]
> The first launch may take some time, as it is necessary to install all frontend and backend dependencies 


4. Open `localhost:8080` in browser.

> [!NOTE]
> By default application uses _backend/volume/_ directory as test mounted volume folder. You can specify test folder in _backend/src/main/resources/application.properties_ file by changing property `root.directory`

