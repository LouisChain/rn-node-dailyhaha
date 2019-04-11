import React, {useEffect} from "react";
import {Alert, Dimensions, Image, Text, View, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {_fetching, fetchGame} from "../../action-reducer/game"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {useNavigation} from "react-navigation-hooks"
import {GAMEPLAYER} from "../../constants/routeConstants";
import FbAdBanner from "../../components/ads/FbAdBanner";
import {showInterstitial} from "../../utils/AdUtils";

const {width, height} = Dimensions.get("window");

const dataProvider = new DataProvider((r1, r2) => {
  return r1.url !== r2.url;
});

const gridType = "GRID"
const windowWidth = Math.round(width * 1000) / 1000; // To deal with precision issues on android //Adjustment for margin given to RLV;
const itemWidth = windowWidth / 2;
const imageWidth = itemWidth - 8;

const layoutProvider = new LayoutProvider(
  index => {
    return gridType;
  },
  (type, dim) => {
    switch (type) {
      case gridType:
        dim.width = itemWidth;
        dim.height = itemWidth + 30;
        break;
      default:
        dim.width = 0;
        dim.height = 0;
    }
  }
);

const renderFooter = () => {
  // return <FooterLoading containerStyle={{width, height: 54}}/>;
};

function FunnyGameScreen(props) {
  // const [page, setPage] = useState(1);
  // const [gifList, setPictureList] = useState(dataProvider);

  useEffect(() => {
    props.fetchGame(props.page)
  }, []);

  const fetchMore = () => {
    if(props.page % 2 === 0) {
      showInterstitial();
    }
    if (props.gameList.length > 0)
      props.fetchGame(props.page)
  }

  const {navigate} = useNavigation();
  const onOpenDetail = (data) => {
    //navigate(GAMEPLAYER, {gameUrl: data.gameUrl})
    Alert.alert("Under construction, please wait")
  }

  const onTagPress = (item) => {
    Alert.alert(item)
  }

  const renderRow = (type, data) => {
    let tags = "";
    for (let i = 0; i < data.tags.length; i++) {
      tags += "#" + data.tags[i] + " "
    }
    return (
      <View style={styles.item.container}>
        <Text numberOfLines={1} style={styles.item.text}>{data.caption}</Text>
        <Text numberOfLines={1} style={styles.item.tags}>{tags}</Text>
        <TouchableOpacity onPress={() => onOpenDetail(data)}>
          <Image
            source={{uri: data.url}}
            style={styles.item.image}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RecyclerListView
        style={{flex: 1}}
        contentContainerStyle={{margin: 0}}
        forceNonDeterministicRendering={true}
        rowRenderer={renderRow}
        dataProvider={dataProvider.cloneWithRows(props.gameList)}
        layoutProvider={layoutProvider}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchMore()}
      />

      <FbAdBanner/>
    </View>
  );
}

const styles = {
  container: {
    flex: 1
  },
  item: {
    container: {
      margin: 2
    },
    text: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
      maxWidth: imageWidth
    },
    image: {
      width: imageWidth,
      height: imageWidth,
      resizeMode: "contain",
    },
    tags: {
      textDecorationLine: "underline"
    }
  }
}

function mapStateToProps(state) {
  const {game} = state;
  const {isFetching, error, gameList, page} = game;
  return {
    isFetching,
    error,
    page,
    gameList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetching: () => dispatch(_fetching()),
    fetchGame: (page) => dispatch(fetchGame(page))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyGameScreen)
