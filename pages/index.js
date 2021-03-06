import React, {Component} from 'react'
import 'isomorphic-fetch'

export default class extends Component {
  state = {
    isLoading: true,
    deckid:'',
    remaining:0,
    drawCount:1,
    cards: [],
    discardPile: []
  }

  componentDidMount() {
    fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`)
      .then(res => res.json())
      // Setting multiple state values from a single source object & a static value - no event
      .then(res => this.setState({deckid: res.deck_id, remaining:res.remaining, isLoading: false}))
  }

  // Setting state from typical event - basically boilerplate for normal inputs
  changeDrawCount = (evt) => this.setState({drawCount:evt.target.value})

  drawCards = (evt) => {
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckid}/draw/?count=${this.state.drawCount}`)
      .then(res => res.json())
      // using the function version of setState to reference previous state (and props if needed with 2nd arg)
      .then(res => this.setState((prevState) => ({cards: res.cards, remaining: res.remaining, discardPile: prevState.discardPile.concat(prevState.cards), drawCount: 1})))
  }

  discard = (code) => {
      const cardIndex = this.state.cards.findIndex(x => x.code === code)
      // Update cards
      const newCards = [...this.state.cards.slice(0, cardIndex), ...this.state.cards.slice(cardIndex+1)]

      // Update discard pile
      const newDiscardPile = this.state.discardPile.concat(this.state.cards[cardIndex])

      this.setState({cards: newCards, discardPile: newDiscardPile})

  }

  render() {
    return (
      <div>
        {this.state.isLoading && <h1>Loading...</h1>}
        <input type='number' value={this.state.drawCount} onChange={this.changeDrawCount} />
        <button onClick={this.drawCards}>Draw Cards</button>
        <label>Remaining Cards in Deck: {this.state.remaining}</label>
        <div>
          <h2>Current Cards</h2>
          {this.state.cards.map(c => <span key={c.code}><img width="200" src={c.images.png}/><button onClick={() => this.discard(c.code)}>discard</button></span>)}
          <h3>Discarded Cards:</h3>
          {this.state.discardPile.map(c => <img key={c.code} width="50" src={c.images.png}/>)}
        </div>
      </div>
    )
  }
}
