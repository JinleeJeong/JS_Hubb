import React, {Component} from 'react';
import './SignInPage.css';
import SignInForm from './SignInForm';
import { AppContext } from '../../contexts/appContext';

class SignInPage extends Component {
    static contextType = AppContext;

    componentDidMount() {
      this.context.actions.checkAuth();
    }

    render (){
        return (
            <div className = "page">
              <div className = "formSize">
              <SignInForm/>
              </div>
            </div>
        );
    }
}

export default SignInPage;
