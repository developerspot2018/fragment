-- welcome123 password: $2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC
-- admin password: $2a$06$xerB1Ch6h6DTXDvc/7c8wu6l8ySfEq5TNeLwU7CXUCXM8No.E6E/i
use mp_dev;

-- Inserting Account Info
INSERT INTO `account` (`acc_id`, `company`, `firstName`, `lastName`, `website`) 
VALUES ('STARINDIA', 'Star', 'StarCEO', 'None', 'startv.in');
INSERT INTO `account` (`acc_id`, `company`, `firstName`, `lastName`, `website`) 
VALUES ('SONYINDIA', 'Sony', 'SonyCEO', 'None', 'sonytv.in');

-- Company creation script
INSERT INTO `company` (`id`, `name`, `type`, `account_fk`, `enabled`)
VALUES ('1', 'STAR', 'INHOUSE', 'STARINDIA', '1');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
VALUES ('2', '1', 'Hero', 'ADVERTISER', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
VALUES ('3', '1', 'Honda', 'ADVERTISER', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
VALUES ('4', '1', 'PEPSI', 'ADVERTISER', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
\VALUES ('5', '1', 'McCann-Erickson India Ltd ', 'AGENCY', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
VALUES ('6', '1', 'Ogilvy & Mather Ltd', 'AGENCY', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`) 
VALUES ('7', '1', 'Rediffusion – DY&R', 'AGENCY', 'STARINDIA');
INSERT INTO `Company` (`id`, `enabled`, `name`, `type`, `account_fk`)
VALUES ('8', '1', 'Sony', 'INHOUSE', 'SONYINDIA');


-- Inserting Grants
INSERT INTO `grants` (`id`, `grant_name`) VALUES ('1', 'password');
INSERT INTO `grants` (`id`, `grant_name`) VALUES ('2', 'client_credentials');
INSERT INTO `grants` (`id`, `grant_name`) VALUES ('3', 'refresh_token');
INSERT INTO `grants` (`id`, `grant_name`) VALUES ('4', 'authorization_code');
INSERT INTO `grants` (`id`, `grant_name`) VALUES ('5', 'implicit');

-- Inserting scopes
INSERT INTO `scope` (`id`, `scope`) VALUES ('1', 'attribute.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('2', 'attribute.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('3', 'attribute.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('4', 'creative.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('5', 'creative.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('6', 'creative.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('7', 'product.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('8', 'product.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('9', 'product.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('10', 'salestarget.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('11', 'salestarget.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('12', 'salestarget.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('13', 'proposal.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('14', 'proposal.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('15', 'proposal.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('16', 'lineitem.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('17', 'lineitem.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('18', 'lineitem.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('19', 'asset.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('20', 'asset.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('21', 'asset.trust');
INSERT INTO `scope` (`id`, `scope`) VALUES ('22', 'client.read');
INSERT INTO `scope` (`id`, `scope`) VALUES ('23', 'client.write');
INSERT INTO `scope` (`id`, `scope`) VALUES ('24', 'client.trust');



-- Inserting Roles
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('1', 'ROLE_ADMIN', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('2', 'ROLE_PLANNER', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`) 
VALUES ('3', 'ROLE_ACCOUNTANT', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('4', 'ROLE_TRAFICKER', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('5', 'ROLE_ADMIN', 'SONYINDIA');

-- Tying scopes to roles
-- admin has trust scope
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '3');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '6');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '9');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '12');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '15');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '18');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '21');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '24');


-- media planner role-scope relation
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '1');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '4');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '7');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '10');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '15');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '18');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '19');

-- Traficker role-scope relation
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '1');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '4');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '7');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '10');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '15');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '18');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '21');

-- Client Info `email`='def@mail.com', `firstName`='dsfgvdfg', `lastName`='safddddddv'
INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('admin@star.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', 1, 'admin@star.com', 'Mramalti', 'Prab');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('mp1@star.com', '6000', 'This is a media planner', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', '1', 'mp1@star.com', 'Ethan', 'Rovelstor');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`)
VALUES ('mp2@star.com', '6000', 'This is a media planner', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', '1', 'mp2@star.com', 'Loe', 'Snaketzaie');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`)
VALUES ('admin@sony.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'SONYINDIA', 8, 'admin@sony.com', 'Kazuo', 'Hirai');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`)
VALUES ('tr1@star.com', '6000', 'This is a Traficker', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', '1', 'tr1@star.com', 'Kris', 'armagaddon');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`)
VALUES ('tr2@star.com', '6000', 'This is a Traficker', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', '1', 'tr2@star.com', 'Liam', 'Hathon' );

-- Attaching roles and grants to client. Here client is admin with grant type client_credentials and refresh_token
INSERT into client_role VALUES ("admin@sony.com",1);
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('mp1@star.com', '2');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('mp2@star.com', '2');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('tr1@star.com', '4');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('tr2@star.com', '4');

INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('admin@star.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('admin@star.com', '3');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('mp1@star.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('mp1@star.com', '3');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('tr1@star.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('tr1@star.com', '3');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('admin@sony.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('admin@sony.com', '3');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('mp2@star.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`) 
VALUES ('mp2@star.com', '3');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('tr2@star.com', '2');
INSERT INTO `client_grant` (`client_id`, `grant_id`)
VALUES ('tr2@star.com', '3');
