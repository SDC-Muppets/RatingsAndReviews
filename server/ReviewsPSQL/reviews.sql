-- reviews.csv
-- id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
-- 1,1,5,1596080481467,"This product was great!","I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.",true,false,"funtime","first.last@gmail.com",null,8
-- 2,1,4,1610178433963,"This product was ok!","I really did not like this product solely because I am tiny and do not fit into it.",false,false,"mymainstreammother","first.last@gmail.com",null,2

-- characteristics_reviews.csv
-- id,characteristic_id,review_id,value
-- 1,1,1,4
-- 2,2,1,3
-- 3,3,1,5

-- reviews_photos.csv
-- id,review_id,url
-- 1,5,"https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
-- 2,5,"https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80"

-- characteristics.csv
-- id,product_id,name
-- 1,1,"Fit"
-- 2,1,"Length"
-- 3,1,"Comfort"
-- 4,1,"Quality"

-- id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness
CREATE TABLE reviews (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  _date TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommended BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (id)
);

-- id,product_id,name
CREATE TABLE characteristics (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  _name TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (id)
);

-- id,characteristic_id,review_id,value
CREATE TABLE characteristics_reviews (
  id INTEGER NOT NULL,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  _value INTEGER NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (id, characteristic_id, review_id),
  FOREIGN KEY (characteristic_id) REFERENCES characteristics(id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);

-- id,review_id,url
CREATE TABLE reviews_photos (
  id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  _url TEXT,
  PRIMARY KEY (id),
  UNIQUE (id, review_id),
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);

-- import reviews.csv to reviews table
COPY reviews
FROM '/Users/claytonuwu/Downloads/reviews.csv'
DELIMITER ','
CSV HEADER;

-- import characteristics.csv
COPY characteristics
FROM '/Users/claytonuwu/Downloads/characteristics.csv'
DELIMITER ','
CSV HEADER;

-- import reviews_characteristics.csv
COPY characteristic_reviews
FROM '/Users/claytonuwu/Downloads/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

-- import reviews_photos.csv
COPY reviews_photos
FROM '/Users/claytonuwu/Downloads/reviews_photos.csv'
DELIMITER ','
CSV HEADER;