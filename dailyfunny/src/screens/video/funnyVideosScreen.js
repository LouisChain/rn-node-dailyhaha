import React, {useEffect, useRef, useState} from "react";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {useNavigation} from "react-navigation-hooks";
import {fetchData, searchData} from "../../action-reducer/video"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../../components/loading/footerLoading";
import {WebView} from "react-native-webview"
import FooterActions from "../../components/FooterActions"
import SearchPanel from "../../components/SearchPanel";
import FbAdBanner from "../../components/ads/FbAdBanner";
import {showInterstitial} from "../../utils/AdUtils";
import ErrorRetry from "../pic/funnyPicsScreen";

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
  const [searchState, setSearchState] = useState({searching: false, query: null, selectedTags: null});
  const [videoId, setVideoId] = useState("a7qRuUAyqCg");
  const [refreshWebView, setRefreshWebView] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   youtubePlayer.current.injectJavaScript(`document.getElementsByClassName("ytp-cued-thumbnail-overlay")[0].click()`)
    // }, 1000)
  }, [videoId])

  useEffect(() => {
    if (props.data.length === 50) {
      setVideoId(props.data[0].utubId)
    }
  }, [props.data])

  useEffect(() => {
    if (searchState.searching) {// switch from feed to search state then reset data to 1st page
      props.searchData(1, searchState.query, searchState.selectedTags, true);
    } else {// switch from search state to feed then reset data to 1st page
      props.fetchData(1, true)
    }
  }, [searchState]);

  const fetchMore = () => {
    if (props.page % 3 === 0 && props.page !== 0) {
      showInterstitial();
    }
    if (props.data.length > 0 && !props.isFetching) {
      onRetry();
    }
  }

  const onTagPress = (item) => {
    setSearchState({
      searching: true,
      query: null,
      selectedTags: [item]
    })
  }

  const onRetry = () => {
    if (searchState.searching) {
      props.searchData(props.page, searchState.query, searchState.selectedTags, false);
    } else {
      props.fetchData(props.page, false)
    }
  }

  const onSearch = (searching, query, selectedTags) => {
    setSearchState({
      searching,
      query,
      selectedTags
    })
  }

  const onComment = (data) => {
    Alert.alert('', "Under construction please be patient")
  }

  const onShare = (data) => {
    Alert.alert('', "Under construction please be patient")
  }

  const playVideo = (id) => {
    setVideoId(id);
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
      {
        props.error ?
          <ErrorRetry errorMessage={props.error} onRetry={onRetry}/>
          :
          (
            <View>
              <WebView
                ref={youtubePlayer}
                style={styles.youtube}
                source={{uri: `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&showinfo=0&loop=0&fs=0&hl=en&enablejsapi=1&origin=http%3A%2F%2Fwww.dailyhaha.com&widgetid=1`}}
                scrollEnabled={false}
                javaScriptEnabled
                onLoadStart={() => setRefreshWebView(true)}
                onLoad={() => setRefreshWebView(false)}
                onError={() => setRefreshWebView(false)}
              />
              {
                refreshWebView && <LoadingView containerStyle={styles.webViewLoading}/>
              }
              <RecyclerListView
                forceNonDeterministicRendering={true}
                rowRenderer={renderRow}
                dataProvider={dataProvider.cloneWithRows(props.data)}
                layoutProvider={layoutProvider}
                onEndReachedThreshold={0.5}
                onEndReached={() => fetchMore()}
                renderFooter={renderFooter}
              />
            </View>
          )
      }
      <SearchPanel
        tags={["Animals", "Cool", "Commercials", "Cartoons", "Extreme", "Magic", "Comedians"]}
        table={"video"}
        onSearch={(a, b, c) => onSearch(a, b, c)}
      />
      <FbAdBanner/>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  item: {
    container: {},
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
  const {isFetching, error, data, page, resetData} = video;
  return {
    isFetching,
    error,
    page,
    data,
    resetData
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: (page, resetData) => dispatch(fetchData(page, resetData)),
    searchData: (page, query, tags, resetData) => dispatch(searchData(page, query, tags, resetData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyVideosScreen)
