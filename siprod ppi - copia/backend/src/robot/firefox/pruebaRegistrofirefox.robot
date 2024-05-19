#prueba realizada en firefox para registrar un usuario nuevo a la pagina

*** Settings ***

Library    SeleniumLibrary

*** Variables ***

${navegador}    firefox
${localhost}    http://localhost:5173/
${cedula}    1000568801
${nombre}    ramon
${primerA}    usuga
${segundoA}    mendez
${fechaN}    20/08/2001
${telefono}    3146671106    
${correo}    prueba60@gmail.com
${contrasenia}    ramon1234
${confirmarContra}    ramon1234

*** Test Cases ***
caso_de_prueba
    Open Browser    ${localhost}    ${navegador}
    registrar_en_pagina
    Close Browser
    

*** Keywords ***
registrar_en_pagina
    Click Element    xpath://*[@id="navbarNav"]/ul/li[4]/a
    Sleep    2s
    Click Element    xpath://*[@id="navbarNav"]/ul/li[4]/ul/li[3]/a
    Sleep    2s
    Input Text    id:inputCedula    ${cedula}
    Input Text    id:inputNombre    ${nombre}
    Input Text    id:inputApellido1    ${primerA}
    Input Text    id:inputApellido2    ${segundoA}
    Input Text    id:inputFechaNac    ${fechaN}
    Input Text    id:inputTelefono    ${telefono}
    Input Text    id:inputCorreo    ${correo}
    Input Text    id:inputContraseña1    ${contrasenia}
    Input Text    id:inputContraseña2    ${confirmarContra}
    Sleep    2s
    Click Element    xpath://*[@id="registro"]/div/div/div[2]/form/button
    Sleep    2s