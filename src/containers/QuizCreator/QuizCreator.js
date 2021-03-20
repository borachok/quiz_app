import React, {Component} from 'react'
import classes from './QuizCreator.module.css'
import Button from "../../components/UI/Button/Button";
import {createControl, validate, validateForm} from '../../form/formFramawork';
import Input from "../../components/UI/Input/Input";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Select from "../../components/UI/Select/Select";
import axios from "../../axios/axios-quiz";

function createOptionControl(number) {
  return createControl({
    label: `Variant - ${number}`,
    errorMessage: 'Значение не может бить пустим',
    id: number
  }, {required: true})
}

function createFormControls() {
  return {
    question: createControl({
      label: 'Введите вопрос',
      errorMessage: 'Вопрос не может бить пустим'
    }, {required: true}),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4),
  }
}


export default class QuizCreator extends Component {

  state = {
    quiz: [],
    rightAnswerId: 1,
    isFormValid: false,
    formControls: createFormControls()
  }

  submitHandler = () => {

  }

  addQuestionHandler = (event) => {
    event.preventDefault();

    const quiz = this.state.quiz.concat();
    const index = quiz.length + 1;
    const {question, option1, option2, option3, option4} = this.state.formControls

    const questionItem = {
      question: question.value,
      id: index,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {test: option1.value, id: option1.id},
        {test: option2.value, id: option2.id},
        {test: option3.value, id: option3.id},
        {test: option4.value, id: option4.id},
      ]
    }

    quiz.push(questionItem);
    this.setState({
      quiz,
      rightAnswerId: 1,
      isFormValid: false,
      formControls: createFormControls()
    })
  }

  createQuizHandler = async (event) => {
    event.preventDefault()
    try {
      await axios.post('/quizes.json', this.state.quiz)
      this.setState({
        quiz: [],
        rightAnswerId: 1,
        isFormValid: false,
        formControls: createFormControls()
      })
    } catch (e) {
      console.log(e)
    }
  }

  changeHandler = (value, controlName) => {
    const formControls = {...this.state.formControls}
    const control = {...formControls[controlName]}

    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation)

    formControls[controlName] = control

    this.setState({
      formControls,
      isFormValid: validateForm(formControls)
    })
  }

  renderControls() {
    return Object.keys(this.state.formControls).map((controlName, index) => {
      const control = this.state.formControls[controlName]


      return (
        <Auxiliary key={controlName + index}>
          <Input
            label={control.label}
            value={control.value}
            valid={control.valid}
            shoudValidate={!!control.validation}
            touched={control.touched}
            errorMessage={control.errorMessage}
            onChange={event => this.changeHandler(event.target.value, controlName)}
          />
          {index === 0 ? <hr/> : null}
        </Auxiliary>

      )
    })
  }

  selectHandler = event => {
    this.setState({
      rightAnswerId: +event.target.value
    })
  }


  render() {

    const select = <Select
      label='Виберите правильний ответ'
      value={this.state.rightAnswerId}
      onChange={this.selectHandler}
      options={[
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4},
      ]}
    />

    return (
      <div className={classes.QuizCreator}>
        <div>
          <h1>Создание теста</h1>

          <form onSubmit={this.submitHandler}>

            {this.renderControls()}

            {select}
            <Button
              type='primary'
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Add Question
            </Button>

            <Button
              type='success'
              onClick={this.createQuizHandler}
              disabled={this.state.quiz.length === 0}
            >
              Create Test
            </Button>
          </form>
        </div>
      </div>
    )
  }
}
