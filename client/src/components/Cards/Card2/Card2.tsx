import React from "react";

import "./Card2.css";

const Card2 = ({ img }) => {
  return (
    <>
      <div className="card">
        <div className="image-container">
          <img src={img} alt="" />

          <div className="price">$49.9</div>
        </div>
        <label className="favorite">
          <input checked="" type="checkbox" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#000000"
          >
            <path d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z"></path>
          </svg>
        </label>

        <div className="content">
          <div className="brand">ADIDAS</div>
          <div className="product-name">Classic oversized hoodie</div>
          <div className="color-size-container">
            <div className="colors">
              Color
              <ul className="colors-container">
                <li className="color">
                  <a href="#"></a>{" "}
                  <span className="color-name">Collegiate Gold</span>
                </li>
                <li className="color active">
                  <a href="#"></a>
                  <span className="color-name">Team Navy</span>
                </li>
                <li className="color">
                  <a href="#"></a>
                  <span className="color-name">Pulse Blue</span>
                </li>
                <li className="color">
                  <a href="#"></a>
                  <span className="color-name">Pink Fusion</span>
                </li>
                +2
              </ul>
            </div>
            <div className="sizes">
              Size
              <ul className="size-container">
                <li className="size">
                  <label className="size-radio">
                    <input name="size" value="xs" type="radio" />
                    <span className="name">XS</span>
                  </label>
                </li>
                <li className="size">
                  <label className="size-radio">
                    <input checked="" name="size" value="s" type="radio" />
                    <span className="name">S</span>
                  </label>
                </li>
                <li className="size">
                  <label className="size-radio">
                    <input name="size" value="m" type="radio" />
                    <span className="name">M</span>
                  </label>
                </li>
                <li className="size">
                  <label className="size-radio">
                    <input name="size" value="l" type="radio" />
                    <span className="name">L</span>
                  </label>
                </li>
                <li className="size">
                  <label className="size-radio">
                    <input name="size" value="xl" type="radio" />
                    <span className="name">XL</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="rating">
            <svg
              viewBox="0 0 99.498 16.286"
              xmlns="http://www.w3.org/2000/svg"
              className="svg four-star-svg"
            >
              <path
                fill="#fc0"
                transform="translate(-0.001 -1.047)"
                d="M9.357,1.558,11.282,5.45a.919.919,0,0,0,.692.5l4.3.624a.916.916,0,0,1,.509,1.564l-3.115,3.029a.916.916,0,0,0-.264.812l.735,4.278a.919.919,0,0,1-1.334.967l-3.85-2.02a.922.922,0,0,0-.855,0l-3.85,2.02a.919.919,0,0,1-1.334-.967l.735-4.278a.916.916,0,0,0-.264-.812L.279,8.14A.916.916,0,0,1,.789,6.576l4.3-.624a.919.919,0,0,0,.692-.5L7.71,1.558A.92.92,0,0,1,9.357,1.558Z"
                id="star-svgrepo-com"
              ></path>
              <path
                fill="#fc0"
                transform="translate(20.607 -1.047)"
                d="M9.357,1.558,11.282,5.45a.919.919,0,0,0,.692.5l4.3.624a.916.916,0,0,1,.509,1.564l-3.115,3.029a.916.916,0,0,0-.264.812l.735,4.278a.919.919,0,0,1-1.334.967l-3.85-2.02a.922.922,0,0,0-.855,0l-3.85,2.02a.919.919,0,0,1-1.334-.967l.735-4.278a.916.916,0,0,0-.264-.812L.279,8.14A.916.916,0,0,1,.789,6.576l4.3-.624a.919.919,0,0,0,.692-.5L7.71,1.558A.92.92,0,0,1,9.357,1.558Z"
                data-name="star-svgrepo-com"
                id="star-svgrepo-com-2"
              ></path>
              <path
                fill="#fc0"
                transform="translate(41.215 -1.047)"
                d="M9.357,1.558,11.282,5.45a.919.919,0,0,0,.692.5l4.3.624a.916.916,0,0,1,.509,1.564l-3.115,3.029a.916.916,0,0,0-.264.812l.735,4.278a.919.919,0,0,1-1.334.967l-3.85-2.02a.922.922,0,0,0-.855,0l-3.85,2.02a.919.919,0,0,1-1.334-.967l.735-4.278a.916.916,0,0,0-.264-.812L.279,8.14A.916.916,0,0,1,.789,6.576l4.3-.624a.919.919,0,0,0,.692-.5L7.71,1.558A.92.92,0,0,1,9.357,1.558Z"
                data-name="star-svgrepo-com"
                id="star-svgrepo-com-3"
              ></path>
              <path
                fill="#fc0"
                transform="translate(61.823 -1.047)"
                d="M9.357,1.558,11.282,5.45a.919.919,0,0,0,.692.5l4.3.624a.916.916,0,0,1,.509,1.564l-3.115,3.029a.916.916,0,0,0-.264.812l.735,4.278a.919.919,0,0,1-1.334.967l-3.85-2.02a.922.922,0,0,0-.855,0l-3.85,2.02a.919.919,0,0,1-1.334-.967l.735-4.278a.916.916,0,0,0-.264-.812L.279,8.14A.916.916,0,0,1,.789,6.576l4.3-.624a.919.919,0,0,0,.692-.5L7.71,1.558A.92.92,0,0,1,9.357,1.558Z"
                data-name="star-svgrepo-com"
                id="star-svgrepo-com-4"
              ></path>
              <path
                fill="#e9e9e9"
                transform="translate(82.431 -1.047)"
                d="M9.357,1.558,11.282,5.45a.919.919,0,0,0,.692.5l4.3.624a.916.916,0,0,1,.509,1.564l-3.115,3.029a.916.916,0,0,0-.264.812l.735,4.278a.919.919,0,0,1-1.334.967l-3.85-2.02a.922.922,0,0,0-.855,0l-3.85,2.02a.919.919,0,0,1-1.334-.967l.735-4.278a.916.916,0,0,0-.264-.812L.279,8.14A.916.916,0,0,1,.789,6.576l4.3-.624a.919.919,0,0,0,.692-.5L7.71,1.558A.92.92,0,0,1,9.357,1.558Z"
                data-name="star-svgrepo-com"
                id="star-svgrepo-com-5"
              ></path>
            </svg>
            (29,062)
          </div>
        </div>

        <div className="button-container">
          <button className="buy-button button">Buy Now</button>
          <button className="cart-button button">
            <svg viewBox="0 0 27.97 25.074" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,1.175A1.173,1.173,0,0,1,1.175,0H3.4A2.743,2.743,0,0,1,5.882,1.567H26.01A1.958,1.958,0,0,1,27.9,4.035l-2.008,7.459a3.532,3.532,0,0,1-3.4,2.61H8.36l.264,1.4a1.18,1.18,0,0,0,1.156.955H23.9a1.175,1.175,0,0,1,0,2.351H9.78a3.522,3.522,0,0,1-3.462-2.865L3.791,2.669A.39.39,0,0,0,3.4,2.351H1.175A1.173,1.173,0,0,1,0,1.175ZM6.269,22.724a2.351,2.351,0,1,1,2.351,2.351A2.351,2.351,0,0,1,6.269,22.724Zm16.455-2.351a2.351,2.351,0,1,1-2.351,2.351A2.351,2.351,0,0,1,22.724,20.373Z"
                id="cart-shopping-solid"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Card2;
