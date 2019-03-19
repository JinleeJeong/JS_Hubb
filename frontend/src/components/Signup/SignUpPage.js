import React, {Component} from 'react';

import './SignUpPage.css';

import SignUpForm from './SignUpForm';
import { AppContext } from '../../contexts/appContext';

class SignUpPage extends Component {
  static contextType = AppContext;

  componentDidMount() {
    this.context.actions.checkAuth();
  }

  render (){
      return (
        <div className = "page">
          <div className = "formSize">
            <SignUpForm/>
          </div>
      </div>
      );
  }
}

export default SignUpPage;

