CREATE TABLE ImageTypes (
    Id INT NOT NULL AUTO_INCREMENT,
    Value varchar(150) NOT NULL,
    CreateDate bigint(20) NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE Images (
    Id INT NOT NULL AUTO_INCREMENT,
    TypeId INT NOT NULL,
    Label varchar(100) NULL,
    Path varchar(150) NOT NULL,
    CreateDate bigint(20) NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id),
    FOREIGN KEY (TypeId) REFERENCES ImageTypes(Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE ImageMetadata (
    Id INT NOT NULL AUTO_INCREMENT,
    ImageId INT NOT NULL,
    Name varchar(100) NULL,
    Value varchar(150) NOT NULL,
    CreateDate bigint(20) NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id),
    FOREIGN KEY (ImageId) REFERENCES Images(Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE ImageObjects (
    Id INT NOT NULL AUTO_INCREMENT,
    ImageId INT NOT NULL,
    Name varchar(100) NULL,
    Confidence decimal(10,0) NOT NULL,
    CreateDate bigint(20) NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id),
    FOREIGN KEY (ImageId) REFERENCES Images(Id)
) DEFAULT CHARSET=latin1;
