CREATE DATABASE mantenimiento_lab;
USE mantenimiento_lab;

CREATE TABLE rol (
    id_rol INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    rol ENUM('Administrador', 'Usuario') NOT NULL
);

CREATE TABLE users (
    id_user INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    rol ENUM('Administrador','Usuario') NOT NULL
);

CREATE TABLE laboratorio (
    id_laboratorio INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nombre_lab VARCHAR(50) NOT NULL
);

CREATE TABLE pc(
    no_serie VARCHAR(20) NOT NULL PRIMARY KEY,
    marca VARCHAR(30) NOT NULL,
    tipo_monitor ENUM('Monitor CRT','Monitor LCD','Monitor con pantalla TFT','Monitor con pantalla plasma','Monitor con pantalla tactil','Monitor con pantalla DLP', 'Monitores OLED') NOT NULL,
    memoria VARCHAR(30) NOT NULL,
    ram VARCHAR(30) NOT NULL,
    procesador VARCHAR(30) NOT NULL,
    estatus ENUM('Funcionando','Reparacion','Baja') NOT NULL,
    tipo_conexion ENUM('Cable','Inalambrica') NOT NULL,
    fk_laboratorio INT(11) NOT NULL,
    FOREIGN KEY (fk_laboratorio) REFERENCES laboratorio(id_laboratorio)
);

CREATE TABLE ticket_soporte (
    id_ticket INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fecha VARCHAR(20) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    persona_rep VARCHAR(50) NOT NULL,
    estatus ENUM('Abierto','Proceso','Cerrado'),
    fk_laboratorio INT(11) NOT NULL,
    fk_no_serie VARCHAR(20) NOT NULL,
    FOREIGN KEY (fk_laboratorio) REFERENCES laboratorio (id_laboratorio),
    FOREIGN KEY (fk_no_serie) REFERENCES pc(no_serie)
);

SELECT a.fecha, a.descripcion, a.persona_rep, a.estatus, a.fk_laboratorio b.nombre_lab, a.fk_no_serie, c.no_serie FROM ticket_soporte a, laboratorio b, pc c WHERE a.fk_laboratorio = b.id_laboratorio and a.fk_no_serie = c.no_serie and id_ticket = ?

CREATE TABLE mantenimiento (
    id_mantenimiento INT(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fk_ticket INT (11) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    estatus ENUM('Funcionando','En Reparacion') NOT NULL,
    FOREIGN KEY (fk_ticket) REFERENCES ticket_soporte(id_ticket)
);

SELECT a.fk_ticket, b.fecha, b.descripcion as desc_ticket, a.descripcion, b.persona_rep, a.descripcion, a.estatus FROM mantenimiento a, ticket_soporte b WHERE a.fk_ticket = b.id_ticket and a.id_mantenimiento = 1