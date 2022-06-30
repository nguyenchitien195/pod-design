import React, { ChangeEvent, useRef, useState } from "react";
import { DraggableData, Rnd } from "react-rnd";
import useClickOutside from "./hooks/useClickOutside";
import { getSizeImageToFitPrintArea } from "./utils/artwork";


export interface IAsset {
  colorId: string;
  file: {
    id: string;
    url: string;
  }
  height: number;
  id: string;
  printAreaScale: number;
  printAreaHeight: number;
  printAreaWidth: number;
  type: string; // background
  width: number;
  x: number;
  y: number;
}

// const getAssetByColorId = (
//   product: IProductClient,
//   printAreaSelected: number
// ): IAsset => {
//   let asset: IAsset = product.printAreas[printAreaSelected].assets[0];
//   const assetFilter = product.printAreas[printAreaSelected].assets.filter(
//     (a) => a.colorId === product.colorIdHover
//   );
//   if (assetFilter.length) {
//     asset = assetFilter[0];
//   }
//   return asset;
// };

interface IFileImage {
  height: number;
  width: number;
  x: number;
  y: number;
  blob: string;
}


function App() {

  const [scale, setScale] = useState<number>(0.8);
  // const [assetSelected, setAssetSelected] = useState<IAsset>(
  //   getAssetByColorId(product, printAreaSelected)
  // );
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [, setLoadedImage] = useState<boolean>(false);
  const [fileImage, setFileImage] = useState<IFileImage>();

  const rndPreviewRef = useRef<Rnd>(null);
  const rndDraggableRef = useRef<Rnd>(null);

  const { ref, isShowComponent, setIsShowComponent } = useClickOutside();

  const handleChangeRange = (e: ChangeEvent<HTMLInputElement>): void => {
    const range = parseInt(e.target.value);
    if (range < 51) {
      const scaleValue = (20 + (range * 8) / 5) / 100;
      setScale(scaleValue);
    } else {
      const scaleValue = (100 + ((range - 50) * 40) / 5) / 100;
      setScale(scaleValue);
    }
  };

  const removeArtwork = (): void => {
    // const newProduct = { ...product };
    // newProduct.printAreas[printAreaSelected].artwork = ARTWORK_CLIENT_DEFAULT;
    // updateProduct(newProduct);
    // if (rndPreviewRef.current) {
    //   rndPreviewRef.current.updatePosition({
    //     x: 0,
    //     y: 0,
    //   });
    //   rndPreviewRef.current.updateSize({
    //     height: 0,
    //     width: 0,
    //   });
    // }
    // if (rndDraggableRef.current) {
    //   rndDraggableRef.current.updatePosition({
    //     x: 0,
    //     y: 0,
    //   });
    //   rndDraggableRef.current.updateSize({
    //     height: 0,
    //     width: 0,
    //   });
    // }
  };

  return (
    <>
      <div className="flex items-center py-2 px-4 justify-between border-b">
        <div className="flex">
          <i className="bx bx-search text-xl mr-2"></i>
          <input type="range" onChange={handleChangeRange} />
          <p className="text-blue-600 text-sm h-6 cursor-pointer ml-4">
            <span>Guides</span>
            <i className="bx bx-caret-down ml-1"></i>
          </p>
        </div>
        <div className="cursor-pointer" onClick={removeArtwork}>
          <i className="text-4xl text-blue-600 bx bx-x"></i>
        </div>
      </div>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: "calc(100% - 108px)" }}
      >
        {fileImage === undefined && (
          <div className="absolute bg-gray-300 p-1 shadow rounded-full w-48 h-48 border border-gray-50 flex items-center justify-center text-center z-10 cursor-pointer hover:bg-white">
            <div>
              <i className="bx bxs-image-add"></i>
              <p className="uppercase text-xs font-medium mb-2">
                Drag or click to upload one or more artwork files
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG supported - 100 MB max
              </p>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="cursor-pointer rounded-full w-40 h-40 absolute top-0 left-0 opacity-0"
              onChange={(e) => {
                if (e.target.files?.length) {
                  const uploadArtworkFormData: FormData = new FormData();
                  uploadArtworkFormData.append("file", e.target.files[0]);
                  const fileUrl = URL.createObjectURL(e.target.files[0]);

                  setLoadedImage(true);

                  const { printAreaWidth, printAreaHeight } = {printAreaWidth: 200, printAreaHeight: 300};

                  const { height, width } = getSizeImageToFitPrintArea(
                    200,
                    300,
                    printAreaHeight,
                    printAreaWidth
                  );

                    setFileImage({
                      height,
                      width,
                      blob: fileUrl,
                      x: 0,
                      y: 0,
                    })
                }
              }}
            />
          </div>
        )}
        <div style={{ transform: `scale(${scale})` }}>
          <img
            src={`https://i.pinimg.com/originals/d8/cc/c6/d8ccc6e04706d7501ccf2c492e93a963.png`}
            alt=""
            style={{
              width: fileImage?.width,
              minWidth: fileImage?.height,
            }}
          />
          {/* Print area */}
          <div
            className={`border border-blue-300 absolute flex items-center justify-center overflow-hidden`}
            style={{
              top: fileImage?.y,
              left: fileImage?.x,
              width: fileImage?.width,
              height: fileImage?.height,
            }}
          >
            <Rnd
              ref={rndPreviewRef}
              default={{
                x: 50,
                y: 40,
                width: 100,
                height: 200,
              }}
              lockAspectRatio
            >
              <img
                src={fileImage?.blob}
                alt=""
                style={{ opacity: isDrag ? 0 : 1 }}
              />
            </Rnd>
          </div>
          {/* Dragable */}
          <div
            className={`absolute flex items-center justify-center`}
            style={{
              top: fileImage?.y,
              left: fileImage?.x,
              width: fileImage?.width,
              height: fileImage?.height,
            }}
          >
            <Rnd
              ref={rndDraggableRef}
              disableDragging={true}
              enableResizing={true}
              default={{
                x: fileImage?.x ?? 20,
                y: fileImage?.y ?? 50,
                width: fileImage?.width ?? 100,
                height: fileImage?.height ?? 200,
              }}
              lockAspectRatio
              onDrag={() => {
                if (!isDrag) {
                  setIsDrag(true);
                }
                if (!isShowComponent) {
                  setIsShowComponent(true);
                }
              }}
              onResizeStart={() => {
                setIsDrag(true);
              }}
              onDragStop={(e, data: DraggableData) => {
                // if (rndPreviewRef.current) {
                //   const newProduct = { ...product };
                //   newProduct.printAreas[printAreaSelected].artwork = {
                //     ...product.printAreas[printAreaSelected].artwork,
                //     x: data.lastX,
                //     y: data.lastY,
                //   };
                //   updateProduct(newProduct);
                // }
                // setIsDrag(false);
              }}
              onResizeStop={(e, dir, eRef, delta, pos) => {
                // if (rndDraggableRef.current && rndPreviewRef.current) {
                //   const position =
                //     rndDraggableRef.current.getDraggablePosition();

                //   const newProduct = { ...product };
                //   newProduct.printAreas[printAreaSelected].artwork = {
                //     ...product.printAreas[printAreaSelected].artwork,
                //     height: parseFloat(eRef.style.height),
                //     width: parseFloat(eRef.style.width),
                //     x: position.x,
                //     y: position.y,
                //   };
                //   updateProduct(newProduct);
                // }
                setIsDrag(false);
              }}
              className={isShowComponent ? "border border-gray-200" : ""}
            >
              <img
                src={fileImage?.blob}
                alt=""
                style={{ opacity: isDrag ? 1 : 0 }}
                ref={ref}
                onClick={() => setIsShowComponent(true)}
              />
            </Rnd>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
