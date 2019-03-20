import React, {useState} from "react"
import {useNavigation, useNavigationParam} from "react-navigation-hooks"
import {Modal, View} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import FooterLoading from "../../components/loading/footerLoading";

function ZoomPicsScreen() {
  const {goBack} = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const data = useNavigationParam("data");
  let url = data.url.replace("_th.", ".");
  if (useNavigationParam("gif")) {
    url = url.replace(".jpg", ".gif");
  }

  return (
    <View
      style={{
        padding: 10
      }}
    >
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => goBack()}
      >
        <ImageViewer
          imageUrls={[{url, freeHeight: true}]}
          onSwipeDown={() => {
            console.log("onSwipeDown");
          }}
          enableSwipeDown={true}
          enableImageZoom={true}
          loadingRender={() => <FooterLoading/>}
          renderIndicator={() => null}
          onSwipeDown={() => goBack()}
        />
      </Modal>
    </View>
  );
}

export default ZoomPicsScreen;