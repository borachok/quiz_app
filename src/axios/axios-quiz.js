import axios from "axios";

export default  axios.create({
  baseURL: 'https://react-redux-quiz-9e84e-default-rtdb.firebaseio.com/'
})
