import React, {Component, Fragment} from 'react';
import movie from '../../images/movie.mp4';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
// import Icon from '@material-ui/core/Icon';
import { AppContext } from '../../contexts/appContext';
import { Link } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import ReactDOM from 'react-dom';
const styles = theme => (
    
  {
      default : {
        color : '#90CAF9',
      },
      appBar: {
        position: 'relative',
      },
      icon: {
        marginRight: theme.spacing.unit * 2,
      },
      heroUnit: {
        backgroundColor: theme.palette.background.paper,
      },
      heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
      },
      heroButtons: {
        marginTop: theme.spacing.unit * 4,
      },
      layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
          width: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
      },
      card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      cardMedia: {
        paddingTop: '56.25%',
      },
      cardContent: {
        flexGrow: 1,
      },
      footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 6,
      },
    
    });
class Template extends Component {
    static contextType = AppContext;
    
    constructor(props) {
      super(props);
      
      this.state = {
        users: [],
        contentsRepresentation1: [],
        contentsRepresentation2: [],
        contentsNew: [],
        contentsAttention1: [],
        contentsAttention2: [],
        searchTerm: '',
        values: 0,
        labelWidth: 0,
      }
      
      this.buttonClicked = this.buttonClicked.bind(this);
    }
  
    buttonClicked(e) {
      this.setState({values: this.state.values+1});
    }
    shouldComponentUpdate(nextProps, nextState) {
      return this.state.values === nextState.values || this.state.searchTerm === nextState.searchTerm;
    }
    
    async componentDidMount() {  
      this.context.actions.checkAuth();
      
      this.context.actions.getCurrentPosition();
    
      this.setState({
        labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
        contentsRepresentation1: await this.context.actions.getContentsRepresentation1(), // 대표 1
        contentsRepresentation2: await this.context.actions.getContentsRepresentation2(), // 대표 2
        
        // Login
        contentsNew: await this.context.actions.getContentsNew(), // 최신순
        contentsAttention1: await this.context.actions.getContentsAttention1(), // 관심 1
        contentsAttention2: await this.context.actions.getContentsAttention2(), // 관심 2
      });

    };
    
    handleChange = event => {
      this.setState({ [event.target.name]: event.target.value,
        searchTerm : event.target.value, 
      }, () => {
        console.log(this.state.searchTerm);
      });
    };
    render() {
      const { lat, lng } = this.context.state;
      console.log(this.state.contentsNew);
      const { classes } = this.props;
      return (
        <Fragment>
          <div className={classes.heroUnit} style={{textAlign:"center"}}>
            <div className={classes.heroContent} style={{maxWidth:"1000px"}}>
                  <video loop autoPlay={true} style={{width:"100%"}}>
                      <source type="video/mp4" data-reactid=".0.1.0.0.0" src={movie} />
                  </video>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Link to={`/write?lat=${lat}&lng=${lng}`}><Button variant="contained" color="primary" style={{ fontSize: "1.5vh", backgroundColor : "#cc66ff", color : "white"}}>스터디 시작하기</Button></Link>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>


          <div className={classNames(classes.layout, classes.cardGrid)}>
          <FormControl style = {{width : "25vh"}}variant="outlined" className={classes.formControl}>
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="outlined-age-simple"
              >
                Category
              </InputLabel>
              <Select
                value={this.state.searchTerm}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="category"
                    id="outlined-age-simple"
                  />
                }
              >
                
                <MenuItem value={'영어'}>영어</MenuItem>
                <MenuItem value={'일본어'}>일본어</MenuItem>
                <MenuItem value={'중국어'}>중국어</MenuItem>
                <MenuItem value={'회화'}>회화</MenuItem>
                <MenuItem value={'취업준비'}>취업준비</MenuItem>
                <MenuItem value={'면접'}>면접</MenuItem>
                <MenuItem value={'자기소개서'}>자기소개서</MenuItem>
                <MenuItem value={'프로젝트'}>프로젝트</MenuItem>
                <MenuItem value={'코딩 테스트'}>코딩 테스트</MenuItem>
                <MenuItem value={'전공'}>전공</MenuItem>
                <MenuItem value={'인적성/NCS'}>인적성/NCS</MenuItem>
              </Select>
        </FormControl>
              
              <Link to={`/category/`+this.state.searchTerm+`/`}>
                 <span 
                    style={{position:"relative", right:"-1.5vh", top:"2vh", color : "black"}}
                    className="glyphicon glyphicon-search" aria-hidden="true" ></span>
              </Link>


          {this.context.state.signInInfo.status === null ? <Button style={{width:'100px'}}> </Button> : this.context.state.signInInfo.status === false ?
                (
                
                  <div>
                  <div style={{textAlign: "right", marginBottom : "3vh"}}>대표 카테고리 Ⅰ</div>
                  <Grid container spacing={40}>
                    {this.state.contentsRepresentation1.map((board, index) => (
                      <Grid item key={index} sm={6} md={3} lg={3}>
                        <Card className={classes.card}>
                        <div key={index}></div>
                          <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                        let path = `detail/`+board.id;
                                        this.props.history.push(path);
      
                                      }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                          <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                            <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                            </Typography>
                            <Typography>
                            {board.categories}
                            </Typography> 
                          </CardContent>
                          <CardActions>
                          
                          </CardActions>
                        </Card>
                      </Grid>
                    
                    ))}
                    </Grid>
                    
                    <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>대표 카테고리 Ⅱ</div>
                    <Grid container spacing={40}>
                    {this.state.contentsRepresentation2.map((board, index) => (
                      <Grid item key={index} sm={6} md={3} lg={3}>
                        <Card className={classes.card}>
                        <div key={index}></div>
                          <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                        let path = `detail/`+board.id;
                                        this.props.history.push(path);
      
                                      }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                          <CardContent className={classes.cardContent}>
                            <Typography gutterBottom variant="h5" component="h2">
                            <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                            </Typography>
                            <Typography>
                            {board.categories}
                            </Typography> 
                          </CardContent>
                          <CardActions>
                          
                          </CardActions>
                        </Card>
                      </Grid>
                    
                    ))}
                    </Grid>
                </div>
                )
                

// login -------------------------------------------------------------------------------------------------------------------------------------------------

                : (
                
                <div>
                <div style={{textAlign: "right", marginBottom : "3vh"}}>모집중!!</div>
                <Grid container spacing={40}>
                  {this.state.contentsNew.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.categories}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>
                  
                  <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>관심 카테고리 Ⅰ</div>
                  <Grid container spacing={40}>
                  {this.state.contentsAttention1.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.categories}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>

                  <div style={{textAlign: "right", margin : "3vh 0 3vh 0 "}}>관심 카테고리 Ⅱ</div>
                  <Grid container spacing={40}>
                  {this.state.contentsAttention2.map((board, index) => (
                    <Grid item key={index} sm={6} md={3} lg={3}>
                      <Card className={classes.card}>
                      <div key={index}></div>
                        <Button style={{ width: "100%", height: "20vh"}}className="" onClick={()=>{
                                      let path = `detail/`+board.id;
                                      this.props.history.push(path);
    
                                    }}><div><img src ={`http://localhost:8080/`+board.imageUrl} alt ="Testing" width ="70%" height="auto"/></div></Button>
                        <CardContent className={classes.cardContent}>
                          <Typography gutterBottom variant="h5" component="h2">
                          <div style ={{marginBottom: "3vh"}}>{board.title}</div>
                          </Typography>
                          <Typography>
                          {board.categories}
                          </Typography> 
                        </CardContent>
                        <CardActions>
                        
                        </CardActions>
                      </Card>
                    </Grid>
                  
                  ))}
                  </Grid>
              </div>
                )}
          </div>
      </Fragment>
      );
  }
};
Template.propTypes = {
      classes: PropTypes.object.isRequired,
    };
export default withStyles(styles)(Template);
  