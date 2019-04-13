import React, {PureComponent} from "react";
import {Animated, Keyboard, TextInput, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import Icon from "../components/Icon";
import SearchLoading from "../components/loading/SearchLoading";
import {debounce} from "throttle-debounce";
import {FONT_SIZE, LAYOUT_SPACING} from "../styles/styles";
import Tags from "../components/tag/Tags";
import PropTypes from "prop-types";
import * as Console from "../utils/logger";

const ANIMATION_TIME = 350;
const TRANSLATE_Y = -200;

class SearchPanel extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    table: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      animation: new Animated.Value(TRANSLATE_Y),
      showTags: false
    }

    this._autocompleteSearchDebounced = debounce(400, this.autoCompleteSearch);
    this._seletedTags = [];
  }

  autoCompleteSearch = (text) => {
    Console.log("Searching...");
    this.props.onSearch(true, text, this._seletedTags);
  };

  changeQuery = text => {
    this._autocompleteSearchDebounced(text);
  };

  onSubmitText = (event) => {
    let text = event.nativeEvent.text;
    this.autoCompleteSearch(text);
  }

  onClearText = () => {
    this.props.onSearch(false, null, null);
    this._input.clear();
    this.onBlur();
  }

  onFocus = () => {
    this._seletedTags = [];
    this.setState({
      showTags: true
    }, () => {
      Animated.timing(this.state.animation, {
        toValue: 0,
        duration: ANIMATION_TIME,
        useNativeDriver: true,
      }).start();
    })
  }

  onBlur = () => {
    Keyboard.dismiss();
    Animated.timing(this.state.animation, {
      toValue: TRANSLATE_Y,
      duration: ANIMATION_TIME,
      useNativeDriver: true,
    }).start(() => {
      this.setState({showTags: false})
    });
  }

  onTagPress = (tag) => {
    let count = 0;
    for (let i = 0; i < this._seletedTags.length; i++) {
      if (this._seletedTags[i] === tag) {
        this._seletedTags = [...this._seletedTags.slice(0, i), ...this._seletedTags.slice(i + 1)]
        break;
      }
      count++;
    }
    if (count === this._seletedTags.length) {
      this._seletedTags.push(tag);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.search.container}>
          <Icon name="search" style={{marginHorizontal: 16}} color="gray"/>
          <TextInput
            ref={c => this._input = c}
            style={styles.search.input}
            multiline={false}
            placeholder="Type caption here..."
            onSubmitEditing={this.onSubmitText}
            onChangeText={this.changeQuery}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          <TouchableOpacity onPress={this.onClearText}>
            <Icon name="close" style={{marginHorizontal: 16}} color="lightgray"/>
          </TouchableOpacity>
          {this.props.isFetching && (
            <SearchLoading size="small" containerStyle={styles.search.loading}/>
          )}
        </View>
        {
          this.state.showTags &&
          <Animated.View style={[styles.tags.container, {transform: [{translateY: this.state.animation}]}]}>
            <Tags
              tags={this.props.tags}
              containerStyle={styles.tags.containerTags}
              onTagPress={this.onTagPress}/>
          </Animated.View>
        }
      </View>
    );
  }
}

const styles = {
  container: {
    position: "absolute",
    width: "100%"
  },
  search: {
    container: {
      flex: 1,
      flexDirection: "row",
      marginHorizontal: LAYOUT_SPACING.xsmall,
      paddingHorizontal: 8,
      height: LAYOUT_SPACING.actionBarHeight,
      backgroundColor: "white",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 0.5,
      borderColor: "lightgray",
      shadowOffset: {width: 10, height: 10},
      shadowColor: "black",
      shadowOpacity: 0.1
    },
    input: {
      color: "black",
      fontSize: FONT_SIZE.large,
      flexDirection: "row",
      flex: 1
    },
    loading: {
      marginRight: 8,
      justifyContent: "center",
      flex: 0.1,
      alignItems: "flex-end"
    },
  },
  tags: {
    container: {
      backgroundColor: "white",
      marginHorizontal: LAYOUT_SPACING.xsmall,
    },
    containerTags: {
      padding: LAYOUT_SPACING.small,
    }
  }
}

function mapStateToProps(state) {
  const {
    isFetching,
  } = state.picture || state.gif || state.video;
  return {
    isFetching,
  }
}

export default connect(mapStateToProps)(SearchPanel)