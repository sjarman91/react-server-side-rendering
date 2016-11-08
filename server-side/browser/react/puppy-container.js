'use strict';
const React = require('react')
const { connect } = require('react-redux');
const { fetchPuppies, like } = require('./redux')

 class PuppyComponent extends React.Component {

  constructor(props){
    super(props)
  }

  componentDidMount() {
    console.log('component mounted')
    console.log('this.props = ', this.props)
    // this.props.fetchPuppies()
  }


  render() {
    console.log('rendering!')
    return (
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Pup vs. Pup!</h1>
            </div>
          </div>
          <div className="row">
          {this.props.puppies && this.props.puppies.map(puppy => (
            <div className="col-sm-6" key={puppy.id}>
              <h3>{puppy.name}</h3>
              <img src={puppy.img} />
              <h2>Likes: {puppy.likes}</h2>
              <div className="btn btn-success" onClick={() => like(puppy.id)}>Like!</div>
            </div>
            ))
          }
        </div>
    </div>
    )
  }
 }

 const mapState = state => ({puppies: state.puppies})
 const mapDispatch = { fetchPuppies, like }

 const PuppyContainer = connect(mapState, mapDispatch)(PuppyComponent)

 module.exports = {PuppyContainer: PuppyContainer}


