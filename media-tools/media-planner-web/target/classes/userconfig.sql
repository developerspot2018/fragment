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
VALUES ('5', '1', 'McCann-Erickson India Ltd ', 'AGENCY', 'STARINDIA');
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
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('1', 'attribute.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('2', 'attribute.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('3', 'attribute.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('4', 'creative.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('5', 'creative.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('6', 'creative.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('7', 'product.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('8', 'product.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('9', 'product.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('10', 'salestarget.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('11', 'salestarget.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('12', 'salestarget.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('13', 'proposal.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('14', 'proposal.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('15', 'proposal.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('16', 'lineitem.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('17', 'lineitem.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('18', 'lineitem.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('19', 'asset.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('20', 'asset.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('21', 'asset.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('22', 'client.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('23', 'client.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('24', 'client.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('25','seasonalDiscount.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('26','seasonalDiscount.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('27','seasonalDiscount.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('28','targettingPremium.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('29','targettingPremium.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('30','targettingPremium.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('31', 'acl.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('32', 'acl.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('33', 'acl.trust','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('34', 'ratecard.read','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('35', 'ratecard.write','STARINDIA');
INSERT INTO `scope` (`id`, `scope`, `account_fk`) VALUES ('36', 'ratecard.trust','STARINDIA');

-- Inserting Roles
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('1', 'ROLE_ADMIN', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('2', 'ROLE_PLANNER', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('4', 'ROLE_TRAFFICKER', 'STARINDIA');
INSERT INTO `role` (`role_id`, `role`, `account_fk`)
VALUES ('3', 'ROLE_ADMIN', 'SONYINDIA');

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
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '25');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '26');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '27');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '30');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '33');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('1', '36');

-- media planner role-scope relation
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '1');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '4');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '7');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '10');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '15');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '18');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '19');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '22');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '23');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '31');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('2', '34');

-- Traficker role-scope relation
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '1');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '4');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '7');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '10');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '15');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '18');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '21');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '23');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '22');
INSERT INTO `role_scope` (`role_id`, `scope_id`) VALUES ('4', '31');


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

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('admin1@star.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', 1, 'admin1@star.com', 'Mramalti', 'Prab');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('admin2@star.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', 1, 'admin2@star.com', 'John', 'MAckay');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('admin3@star.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', 1, 'admin3@star.com', 'Amon', 'Lee');

INSERT INTO `oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`, `company_id`, `email`, `firstName`, `lastName`) 
VALUES ('admin4@star.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA', 1, 'admin4@star.com', 'Nathan', 'Astle');


-- Attaching roles and grants to client. Here client is admin with grant type client_credentials and refresh_token
INSERT into client_role VALUES ("admin@sony.com",1);
INSERT INTO client_role VALUES ("admin@star.com",1);
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('mp1@star.com', '2');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('mp2@star.com', '2');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('tr1@star.com', '4');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('tr2@star.com', '4');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('admin1@star.com', '1');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('admin2@star.com', '1');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('admin3@star.com', '1');
INSERT INTO `client_role` (`client_id`, `role_id`) VALUES ('admin4@star.com', '1');

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


