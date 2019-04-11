import React, {useEffect} from "react";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "react-navigation-hooks"
import {connect} from "react-redux";
import {fetchPicture, searchPicture} from "../../action-reducer/gif"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../pic/funnyPicsScreen";
import {PICDETAIL} from "../../constants/routeConstants";
import FooterActions from "../../components/FooterActions";
import SearchPanel from "../../components/SearchPanel";
import FbAdBanner from "../../components/ads/FbAdBanner";
import {showInterstitial} from "../../utils/AdUtils";

const {width} = Dimensions.get("window");

const dataProvider = new DataProvider((r1, r2) => {
  return r1.url !== r2.url;
});

const layoutProvider = new LayoutProvider(
  index => {
    return 0;
  },
  (type, dim) => {
    switch (type) {
      case 0:
        dim.width = width;
        dim.height = 32 + 12 + 24 + 30 + 16 + 24 + width;
        break;
    }
  }
);

function FunnyGifScreen(props) {
  const {navigate} = useNavigation();

  useEffect(() => {
    props.fetchPicture(props.page)
  }, []);

  const fetchMore = () => {
    if(props.page % 2 === 0) {
      showInterstitial();
    }
    if (props.gifList.length > 0 && !props.isFetching)
      props.fetchPicture(props.page)
  }

  const onTagPress = (item) => {
    props.onSearchTag(1, null, [item]);
  }

  const onComment = (data) => {
    Alert.alert("Under construction please be patient")
  }

  const onShare = (data) => {
    Alert.alert("Under construction please be patient")
  }

  const renderRow = (type, data) => {
    return (
      <View style={styles.item.container}>
        <Text numberOfLines={1} style={styles.item.text}>{data.caption}</Text>
        <Tags tags={data.tags} onTagPress={(item) => onTagPress(item)}/>
        <TouchableOpacity onPress={() => navigate(PICDETAIL, {data, gif: true})}>
          <Image
            source={{uri: data.url.replace(".jpg", ".gif")}}
            style={styles.item.image}
          />
        </TouchableOpacity>
        <FooterActions {...data} onComment={() => onComment(data)} onShare={() => onShare(data)}/>
      </View>
    );
  }

  const renderFooter = () => {
    //Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    //The empty view can be removed once you've fetched all the data
    return props.isFetching
      ? <LoadingView containerStyles={{margin: 10, height: 60}}/>
      : <View style={{height: 60}}/>;
  };

  return (
    <View style={styles.container}>
      <RecyclerListView
        forceNonDeterministicRendering={true}
        rowRenderer={renderRow}
        dataProvider={dataProvider.cloneWithRows(props.gifList)}
        layoutProvider={layoutProvider}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchMore()}
        renderFooter={renderFooter}
      />
      <SearchPanel
        tags={["Animals", "Fail", "Weird", "Cats", "Cool", "Gross", "Pranks", "Dogs", "Funny Gifs"]}
        table={"gif"}
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
      paddingTop: LAYOUT_SPACING.normal
    },
    text: {
      color: "black",
      fontSize: FONT_SIZE.veryLarge,
      fontWeight: "bold",
      paddingHorizontal: LAYOUT_SPACING.normal,
    },
    image: {
      width,
      height: width,
      resizeMode: "contain"
    }
  }
}

function mapStateToProps(state) {
  const {gif} = state;
  const {isFetching, error, gifList, page} = gif;
  return {
    isFetching,
    error,
    page,
    gifList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPicture: (page) => dispatch(fetchPicture(page)),
    onSearchTag: (page, e, tags) => dispatch(searchPicture(page, e, tags)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyGifScreen)
