/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from './Rating.jsx';
import Characteristics from './Characteristics.jsx';
import Recommend from './Recommend.jsx';
import Summary from './Summary.jsx';
import Body from './Body.jsx';
import UploadPhotos from './UploadPhotos.jsx';
import Nickname from './Nickname.jsx';
import Email from './Email.jsx';

const styles = {
  modalContainer: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%',
    backgroundColor: '#fff',
    padding: '50px',
    height: '75%',
    width: '50%',
    zIndex: 1000,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7',
    zIndex: 1000,
  },
  modalItems: {
    overflow: 'scroll',
    maxWidth: '100%',
    maxHeight: '40vh',
    padding: '2rem',
  },
  xReviewBtn: {
    marginTop: '2px',
    marginRight: '2px',
    position: 'absolute',
    top: '0',
    right: '0',
    cursor: 'pointer',
  },
  cancelReviewBtn: {
    cursor: 'pointer',
  },
  submitReviewBtn: {
    cursor: 'pointer',
  },
};

export default function Modal({ showModal, onClose }) {
  if (!showModal) return null;

  const [starRating, setStarRating] = useState();
  const [recommendProduct, setRecommendProduct] = useState();
  const [summaryText, setSummaryText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedImage, setSelectedImage] = useState([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [descriptionRate, setDescriptionRate] = useState({
    Comfort: null,
    Fit: null,
    Length: null,
    Size: null,
    Quality: null,
    Width: null,
  });

  const ratingType = ['Poor', 'Fair', 'Average', 'Good', 'Great'];

  // function postReview() {
  //   const id = Number(localStorage.getItem('productId'));
  //   const characteristicsIds = JSON.parse(localStorage.getItem('characteristicsObj'));
  //   const nameArray = localStorage.getItem('characteristicsArray').split(',');
  //   const charPostObj = {};

  //   for (let i = 0; i < nameArray.length; i += 1) {
  //     const val = characteristicsIds[nameArray[i]];
  //     charPostObj[val] = descriptionRate[nameArray[i]];
  //   }
  //   console.log('charPostObj: ', charPostObj);
  //   axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews', {
  //     headers: {
  //       Authorization: process.env.GITKEY,
  //     },
  //     params: {
  //       product_id: id,
  //       rating: starRating,
  //       summary: bodyText,
  //       recommend: recommendProduct,
  //       name: nickname,
  //       email,
  //       photos: selectedImage,
  //       characteristics: charPostObj,
  //     },
  //   })
  // }

  function handleSubmit(event) {
    if (!starRating || bodyText.length < 50) {
      if (!starRating) {
        alert('Please rate this product');
      }
      if (bodyText.length < 50) {
        event.preventDefault();
        alert('Please type at least 50 characters in the body section');
      }
    } else {
      event.preventDefault();
      console.log('submitted: ', event.target);
      postReview();
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, [showModal]);

  return (
    <>
      <div style={styles.modalOverlay} />
      <div style={styles.modalContainer}>
        <form onSubmit={(event) => handleSubmit(event)}>
          <button type="button" onClick={onClose} style={styles.xReviewBtn}>X</button>
          <br />
          <h1>Write Your Review for:</h1>
          <br />
          <h2>
            {localStorage.getItem('productName')}
          </h2>
          <br />
          <div style={styles.modalItems}>
            <b>Overall Rating:</b>
            *
            <br />
            <Rating
              starRating={starRating}
              changeRating={(userRating) => setStarRating(userRating)}
            />
            {' '}
            {ratingType[starRating - 1]}
            <br />
            <br />
            <b>Do You Recommend This Product?</b>
            *
            <br />
            <Recommend
              recommendProduct={recommendProduct}
              setRecommendProduct={(recommend) => setRecommendProduct(recommend)}
            />
            <br />
            <b>Characteristics:</b>
            *
            <Characteristics
              descriptionRate={descriptionRate}
              setDescriptionRate={(value) => { setDescriptionRate(value); }}
            />
            <br />
            <b>Summary:</b>
            *
            <br />
            <Summary
              summaryText={summaryText}
              setSummaryText={setSummaryText}
            />
            <br />
            <b>Body:</b>
            *
            <br />
            <Body
              bodyText={bodyText}
              setBodyText={(text) => setBodyText(text)}
            />
            <br />
            <b>Upload photos:</b>
            <br />
            <UploadPhotos
              selectedImage={selectedImage}
              setSelectedImage={(image) => setSelectedImage(image)}
            />
            <br />
            <b>Nickname:</b>
            *
            <br />
            <Nickname
              nickname={nickname}
              setNickname={(value) => setNickname(value)}
            />
            <br />
            <b>Email:</b>
            *
            <br />
            <Email
              email={email}
              setEmail={(value) => setEmail(value)}
            />
          </div>
          <br />
          <input type="button" value="Cancel" onClick={onClose} style={styles.cancelReviewBtn} />
          <input type="submit" style={styles.submitReviewBtn} value="Submit" />
        </form>
      </div>
    </>
  );
}
