# DevRel AMAs

The Nym Technology Developer Relations AMA (Ask Me Anything) is an event organised by the Nym team to engage and connect with the developer community as well as answer any questions that they may have. 

> ⚠️ Hosted every fortnight on Wednesday @ 4pm UTC

Checkout out our playlist below:

<!--HTML-->

## 2023
<div class="video-slider">
  <div class="video-container">
    <div class="video">
      <iframe src="https://www.youtube.com/embed/smPPle_I8T8" frameborder="0" allowfullscreen></iframe>
      <div class="video-title">22th February</div>
    </div>
  </div>
  <div class="video-container">
    <div class="video">
      <iframe src="https://www.youtube.com/embed/Uytu2a8mNEw" frameborder="0" allowfullscreen></iframe>
      <div class="video-title">8th February</div>
    </div>
  </div>
  <div class="video-container">
    <div class="video">
      <iframe src="https://www.youtube.com/embed/2mSqInSgj6c" frameborder="0" allowfullscreen></iframe>
      <div class="video-title">25th January</div>
    </div>
  </div>
  <div class="video-container">
    <div class="video">
      <iframe src="https://www.youtube.com/embed/_Udy7wzwPts" frameborder="0" allowfullscreen></iframe>
      <div class="video-title">11th January</div>
    </div>
  </div>
</div>

## 2022
<div class="video-slider">
  <div class="video-container">
    <div class="video">
      <iframe src="https://www.youtube.com/embed/0kVXR7aNOyg" frameborder="0" allowfullscreen></iframe>
      <div class="video-title">20th December</div>
    </div>
  </div>
</div>


<!--CSS-->

<style>
  .video-slider {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
  }

  .video-container {
    flex: 0 0 auto;
    margin-right: 10px;
    width: 320px;
    height: 180px;
    border: 2px solid #000;
    scroll-snap-align: start;
  }

  .video {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
  }

  .video iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    border: none;
  }

.video-title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 5px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
</style>



