CREATE TABLE Images (
    Id int(11) NOT NULL AUTO_INCREMENT,
    TypeId int(11) NOT NULL,
    Label varchar(100) NULL,
    Path varchar(150) NOT NULL,
    CreateDate bigint(20) unsigned DEFAULT NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id)
    CONSTRAINT "Images_TypeId_ImageTypes_Id" FOREIGN KEY (TypeId) REFERENCES ImageTypes(Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE ImageTypes (
    Id int(11) NOT NULL AUTO_INCREMENT,
    Value varchar(150) NOT NULL,
    CreateDate bigint(20) unsigned DEFAULT NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE ImageMetadata (
    Id int(11) NOT NULL AUTO_INCREMENT,
    ImageId int(11) NOT NULL,
    Name varchar(100) NULL,
    Value varchar(150) NOT NULL,
    CreateDate bigint(20) unsigned DEFAULT NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id)
    CONSTRAINT "ImageMetadata_ImageId_Images_Id" FOREIGN KEY (ImageId) REFERENCES Images(Id)
) DEFAULT CHARSET=latin1;

CREATE TABLE ImageObjects (
    Id int(11) NOT NULL AUTO_INCREMENT,
    ImageId int(11) NOT NULL,
    Name varchar(100) NULL,
    Confidence varchar(150) NOT NULL,
    CreateDate bigint(20) unsigned DEFAULT NOT NULL,
    IsActive tinyint(1) DEFAULT '1',
    PRIMARY KEY (Id)
    CONSTRAINT "ImageObjects_ImageId_Images_Id" FOREIGN KEY (ImageId) REFERENCES Images(Id)
) DEFAULT CHARSET=latin1;
