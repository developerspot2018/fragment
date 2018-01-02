-- welcome123 password: $2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC
-- admin password: $2a$06$xerB1Ch6h6DTXDvc/7c8wu6l8ySfEq5TNeLwU7CXUCXM8No.E6E/i

-- Inserting Account Info
INSERT INTO `mp_dev`.`account` (`acc_id`, `company`, `firstName`, `lastName`, `website`) 
VALUES ('STARINDIA', 'Star', 'StarCEO', 'None', 'startv.in');
INSERT INTO `mp_dev`.`account` (`acc_id`, `company`, `firstName`, `lastName`, `website`) 
VALUES ('SONYINDIA', 'Sony', 'SonyCEO', 'None', 'sonytv.in');

-- Inserting Grants
INSERT INTO `mp_dev`.`grants` (`id`, `grant_name`) VALUES ('1', 'password');
INSERT INTO `mp_dev`.`grants` (`id`, `grant_name`) VALUES ('2', 'client_credentials');
INSERT INTO `mp_dev`.`grants` (`id`, `grant_name`) VALUES ('3', 'refresh_token');
INSERT INTO `mp_dev`.`grants` (`id`, `grant_name`) VALUES ('4', 'authorization_code');
INSERT INTO `mp_dev`.`grants` (`id`, `grant_name`) VALUES ('5', 'implicit');

-- Inserting scopes
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('1', 'attribute.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('2', 'attribute.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('3', 'attribute.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('4', 'creative.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('5', 'creative.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('6', 'creative.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('7', 'product.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('8', 'product.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('9', 'product.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('10', 'salestarget.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('11', 'salestarget.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('12', 'salestarget.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('13', 'proposal.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('14', 'proposal.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('15', 'proposal.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('16', 'lineitem.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('17', 'lineitem.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('18', 'lineitem.trust');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('19', 'asset.read');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('20', 'asset.write');
INSERT INTO `mp_dev`.`scope` (`id`, `scope`) VALUES ('21', 'asset.trust');


-- Inserting Roles
INSERT INTO `mp_dev`.`role` (`id`, `role`) VALUES ('1', 'ROLE_ADMIN');
INSERT INTO `mp_dev`.`role` (`id`, `role`) VALUES ('2', 'ROLE_PLANNER');
INSERT INTO `mp_dev`.`role` (`id`, `role`) VALUES ('2', 'ROLE_ACCOUNTANT');
INSERT INTO `mp_dev`.`role` (`id`, `role`) VALUES ('2', 'ROLE_TRAFICKER');

-- Tying scopes to roles
-- admin has trust scope
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '1');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '2');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '3');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '9');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '12');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '15');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '18');
INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('1', '21');

INSERT INTO `mp_dev`.`role_scope` (`role_id`, `scope_id`) VALUES ('2', '1');

-- Client Info
INSERT INTO `mp_dev`.`oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`) 
VALUES ('abc@mail.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'STARINDIA');

INSERT INTO `mp_dev`.`oauth_client_details` (`client_id`, `access_token_validity`, `additional_information`, `autoApprove`, `client_secret`, `refresh_token_validity`, `resource_ids`, `account_fk`)
VALUES ('def@mail.com', '6000', 'This is admin User', 1, '$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC', '18000', 'mp-tool', 'SONYINDIA');


-- Attaching roles and grants to client. Here client is admin with grant type client_credentials and refresh_token
INSERT into mp_dev.client_role VALUES ("abc@mail.com",1);
INSERT INTO `mp_dev`.`client_grant` (`client_id`, `grant_id`) VALUES ('abc@mail.com', '2');
INSERT INTO `mp_dev`.`client_grant` (`client_id`, `grant_id`) VALUES ('abc@mail.com', '3');