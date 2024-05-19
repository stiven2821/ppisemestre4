*** Settings ***

Library    SeleniumLibrary

*** Variables ***

${navegador}    Chrome
${localhost}    http://localhost:5173/
# Datos de inicio de sesión
${correo}    brahyan1234@gmail.com
${contrasenia}    pepe1234
# Datos del usuario
${cedula}    12333322212
${CorreoUser}    carlas@gmail.com
${nombre}    Carlos
${PrimerApellido}    Meneses
${Sapellido}    Ozuna
${ContraseniaUser}    pepe123443
${fecha}    2003-03-12
${telefono}    3198277161

*** Test Cases ***
test_case
    Open Browser    ${localhost}    ${navegador}
    inicio_sesion_pagina
    Close Browser

*** Keywords ***
inicio_sesion_pagina
    Click Element    xpath=//*[@id="navbarNav"]/ul/li[4]/a
    Wait Until Element Is Visible    xpath=//*[@id="navbarNav"]/ul/li[4]/ul/li[1]/a    10s
    Click Element    xpath=//*[@id="navbarNav"]/ul/li[4]/ul/li[1]/a
    Wait Until Element Is Visible    id=inputCorreoL    10s
    Input Text    id=inputCorreoL    ${correo}
    Input Text    id=inputPass    ${contrasenia}
    Click Element    xpath=//*[@id="inicioSesion"]/div/div/div[2]/form/input
    Wait Until Element Is Visible    xpath=/html/body/div[3]/div/div[6]/button[1]    10s
    Click Element    xpath=/html/body/div[3]/div/div[6]/button[1]
    Wait Until Element Is Visible    xpath=//*[@id="navbarNav"]/ul/li[5]/a    10s
    Click Element    xpath=//*[@id="navbarNav"]/ul/li[5]/a
    Wait Until Element Is Visible    xpath=//*[@id="root"]/div/div/div/div[2]/a[1]/i    10s
    Click Element    xpath=//*[@id="root"]/div/div/div/div[2]/a[1]/i
    Wait Until Element Is Visible    xpath=//select[@class="form-select"]    10s
    Select From List By Value    xpath=//select[@class="form-select"]    2
    Input Text    name=inputCedula    ${cedula}
    Input Text    name=inputCorreo    ${CorreoUser}
    Input Text    name=inputNombre    ${nombre}
    Input Text    name=inputApellido1    ${PrimerApellido}
    Input Text    name=inputApellido2    ${Sapellido}
    Input Password    name=inputContraseña1    ${ContraseniaUser}
    Input Password    name=inputContraseña2    ${ContraseniaUser}
    Input Text    name=inputFechaNac    ${fecha}
    Input Text    name=inputTelefono    ${telefono}
    Click Element    xpath=//button[@type='submit']
    Sleep    3s
    Press Key    xpath:/html/body/div[2]/div/div[6]/button[1]    \\13
    Sleep    3s