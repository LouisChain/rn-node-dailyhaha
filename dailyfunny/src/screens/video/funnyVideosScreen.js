import React, {useEffect, useRef, useState} from "react";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {useNavigation} from "react-navigation-hooks";
import {fetchVideo, searchPicture} from "../../action-reducer/video"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../../components/loading/footerLoading";
import {WebView} from "react-native-webview"
import FooterActions from "../../components/FooterActions"
import SearchPanel from "../../components/SearchPanel";

const {width} = Dimensions.get("window");

const webViewHeight = width * 3 / 4;

const imageHeight = width * 5 / 6;

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
        dim.height = 32 + 24 + 30 + 16 + 24 + imageHeight;
        break;
    }
  }
);

function FunnyVideosScreen(props) {
  const youtubePlayer = useRef();
  const {navigate} = useNavigation();
  const [videoId, setVideoId] = useState("a7qRuUAyqCg");
  const [refreshWebView, setRefreshWebView] = useState(false);
  // const [play, setPlay] = useState(false);
  // const [loop, setLoop] = useState(false);
  // const [fullScreen, setFullScreen] = useState(false);
  // const [bugYoutube, setBugYoutube] = useState(true);

  useEffect(() => {
    props.fetchVideo(props.page)

    return () => {
      //Unmounting
    }
  }, []);

  useEffect(() => {
    // setTimeout(() => {
    //   youtubePlayer.current.injectJavaScript(`document.getElementsByClassName("ytp-cued-thumbnail-overlay")[0].click()`)
    // }, 1000)
  }, [videoId])

  useEffect(() => {
    if (props.videoList.length === 50) {
      setVideoId(props.videoList[0].utubId)
    }
  }, [props.videoList])

  const fetchMore = () => {
    if (props.videoList.length > 0 && !props.isFetching)
      props.fetchVideo(props.page)
  }

  const playVideo = (id) => {
    setVideoId(id);
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
        <TouchableOpacity onPress={() => playVideo(data.utubId)}>
          <Image
            source={{uri: data.url}}
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
      {/*<NavigationEvents*/}
      {/*onWillFocus={payload => {*/}
      {/*setBugYoutube(false);*/}
      {/*}}*/}
      {/*onWillBlur={payload => {*/}
      {/*setBugYoutube(true);*/}
      {/*}}*/}
      {/*/>*/}
      {/*{!bugYoutube &&*/}
      {/*<YouTube*/}
      {/*ref={youtubePlayer}*/}
      {/*apiKey="Nothing"*/}
      {/*videoId={videoId}*/}
      {/*play={play}*/}
      {/*loop={loop}*/}
      {/*fullscreen={fullScreen}*/}
      {/*showFullscreenButton={true}*/}
      {/*rel={false}*/}
      {/*controls={1}*/}
      {/*style={[*/}
      {/*{height: PixelRatio.roundToNearestPixel(width / (16 / 9))},*/}
      {/*styles.youtube,*/}
      {/*]}*/}
      {/*onError={e => Alert.alert(e.error)}*/}
      {/*onProgress={e => {*/}
      {/*}}*/}
      {/*/>*/}
      {/*}*/}
      <WebView
        ref={youtubePlayer}
        style={styles.youtube}
        source={{uri: `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&showinfo=0&loop=0&fs=0&hl=en&enablejsapi=1&origin=http%3A%2F%2Fwww.dailyhaha.com&widgetid=1`}}
        scrollEnabled={false}
        javaScriptEnabled
        onLoadStart={() => setRefreshWebView(true)}
        onLoad={() => setRefreshWebView(false)}
      />
      {refreshWebView && (
        <LoadingView containerStyle={styles.webViewLoading}/>
      )}
      <RecyclerListView
        style={styles.list}
        forceNonDeterministicRendering={true}
        rowRenderer={renderRow}
        dataProvider={dataProvider.cloneWithRows(props.videoList)}
        layoutProvider={layoutProvider}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchMore()}
        renderFooter={renderFooter}
      />
      <SearchPanel
        tags={["Animals", "Cool", "Commercials", "Cartoons", "Extreme", "Magic", "Comedians"]}
        table={"video"}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  item: {
    container: {
    },
    text: {
      color: "lightgray",
      fontSize: FONT_SIZE.veryLarge,
      fontWeight: "bold",
      paddingLeft: LAYOUT_SPACING.normal,
    },
    image: {
      width: width,
      height: imageHeight,
      resizeMode: "contain"
    }
  },
  webViewLoading: {
    position: "absolute",
    top: 0,
    width,
    height: webViewHeight,
    backgroundColor: "black"
  },
  youtube: {
    position: "absolute",
    top: LAYOUT_SPACING.actionBarHeight,
    width,
    height: webViewHeight
    // alignSelf: 'stretch',
    // marginVertical: LAYOUT_SPACING.small,
  },
  list: {
    marginTop: webViewHeight,
    backgroundColor: "black"
  }
}

function mapStateToProps(state) {
  const {video} = state;
  const {isFetching, error, videoList, page} = video;
  return {
    isFetching,
    error,
    page,
    videoList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchVideo: (page) => dispatch(fetchVideo(page)),
    onSearchTag: (page, e, tags) => dispatch(searchPicture(page, e, tags)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyVideosScreen)
