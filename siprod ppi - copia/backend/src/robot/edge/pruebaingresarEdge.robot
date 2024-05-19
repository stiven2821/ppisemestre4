#prueba en edge realizada para iniciar sesion con un usuario ya creado 

*** Settings ***

Library    SeleniumLibrary

*** Variables ***

${navegador}    edge
${localhost}    http://localhost:5173/
${correo}    prueba50@gmail.com
${contrasenia}    horacio1234
*** Test Cases ***
test_case
    Open Browser    ${localhost}    ${navegador}
    inicio_sesion_pagina
    Close Browser


*** Keywords ***
inicio_sesion_pagina
    Click Element    xpath://*[@id="navbarNav"]/ul/li[4]/a
    Sleep    2s
    Click Element    xpath://*[@id="navbarNav"]/ul/li[4]/ul/li[1]/a
    Sleep    2s
    Input Text    id:inputCorreoL    ${correo}
    Input Text    id:inputPass    ${contrasenia}
    Click Element    xpath://*[@id="inicioSesion"]/div/div/div[2]/form/input
    Sleep    3s
    Click Element    xpath:/html/body/div[3]/div/div[6]/button[1]
    Sleep    4s

    