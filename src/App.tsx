import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DraggableData, Rnd } from "react-rnd";
import useClickOutside from "./hooks/useClickOutside";
import { getSizeImageToFitPrintArea } from "./utils/artwork";

interface IArtwork {
  height: number;
  width: number;
  x: number;
  y: number;
  blob: string;
}

interface IProduct {
  x: number;
  y: number;
  printAreaHeight: number;
  printAreaWidth: number;
  artwork: IArtwork;
  mockup: {
    url: string;
    width: number;
    height: number;
  };
}

const ARTWORK_CLIENT_DEFAULT = {
  blob: "",
  height: 0,
  width: 0,
  x: 0,
  y: 0,
};

const PRODUCT_DEFAULT: IProduct = {
  x: 194,
  y: 180,
  printAreaHeight: 300,
  printAreaWidth: 280,
  mockup: {
    url: "https://i.pinimg.com/originals/d8/cc/c6/d8ccc6e04706d7501ccf2c492e93a963.png",
    width: 680,
    height: 680,
  },
  artwork: ARTWORK_CLIENT_DEFAULT,
};

function App() {
  const [scale, setScale] = useState<number>(0.8);
  const [product, setProduct] = useState<IProduct>(PRODUCT_DEFAULT);
  const [isDrag, setIsDrag] = useState<boolean>(false);
  const [, setLoadedImage] = useState<boolean>(false);

  const rndPreviewRef = useRef<Rnd>(null);
  const rndDraggableRef = useRef<Rnd>(null);

  const { ref, isShowComponent, setIsShowComponent } = useClickOutside();

  useEffect((): void => {
    if (rndPreviewRef.current) {
      rndPreviewRef.current.updatePosition({
        x: product.artwork.x,
        y: product.artwork.y,
      });
      rndPreviewRef.current.updateSize({
        height: product.artwork.height,
        width: product.artwork.width,
      });
    }
    if (rndDraggableRef.current) {
      rndDraggableRef.current.updatePosition({
        x: product.artwork.x,
        y: product.artwork.y,
      });
      rndDraggableRef.current.updateSize({
        height: product.artwork.height,
        width: product.artwork.width,
      });
    }
  }, [
    // printAreaSelected,
    product.artwork.x,
    product.artwork.y,
    product.artwork.height,
    product.artwork.width,
  ]);

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
    const newProduct = { ...product };
    newProduct.artwork = ARTWORK_CLIENT_DEFAULT;
    setProduct(newProduct);
    if (rndPreviewRef.current) {
      rndPreviewRef.current.updatePosition({
        x: 0,
        y: 0,
      });
      rndPreviewRef.current.updateSize({
        height: 0,
        width: 0,
      });
    }
    if (rndDraggableRef.current) {
      rndDraggableRef.current.updatePosition({
        x: 0,
        y: 0,
      });
      rndDraggableRef.current.updateSize({
        height: 0,
        width: 0,
      });
    }
  };

  return (
    <>
      <div className="flex items-center py-2 px-4 justify-between border-b">
        <div className="flex">
          <i className="bx bx-search text-xl mr-2"></i>
          <input type="range" onChange={handleChangeRange} />
          {/* <p className="text-blue-600 text-sm h-6 cursor-pointer ml-4">
            <span>Guides</span>
            <i className="bx bx-caret-down ml-1"></i>
          </p> */}
        </div>
        <div className="cursor-pointer" onClick={removeArtwork}>
          <i className="text-4xl text-blue-600 bx bx-x"></i>
        </div>
      </div>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ height: "calc(100% - 108px)" }}
      >
        {!product.artwork.blob && (
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
                  const fileUrl = URL.createObjectURL(e.target.files[0]);

                  const image = new Image();
                  image.src = fileUrl;
                  image.onload = () => {
                    setLoadedImage(true);

                    const { printAreaWidth, printAreaHeight } = product;

                    const { height, width } = getSizeImageToFitPrintArea(
                      image.height,
                      image.width,
                      printAreaHeight,
                      printAreaWidth
                    );

                    const newProduct = { ...product };
                    newProduct.artwork = {
                      height,
                      width,
                      blob: fileUrl,
                      x: 0,
                      y: 0,
                    };
                    setProduct(newProduct);
                  };
                }
              }}
            />
          </div>
        )}
        <div style={{ transform: `scale(${scale})` }}>
          <img
            src={product.mockup.url}
            alt=""
            style={{
              width: product.mockup.width,
              minWidth: product.mockup.height,
            }}
          />
          {/* Print area */}
          <div
            className={`border border-blue-300 absolute flex items-center justify-center overflow-hidden`}
            style={{
              top: product.y,
              left: product.x,
              width: product.printAreaWidth,
              height: product.printAreaHeight,
            }}
          >
            <Rnd
              ref={rndPreviewRef}
              default={{
                x: product.artwork.x,
                y: product.artwork.y,
                width: product.artwork.width,
                height: product.artwork.height,
              }}
              lockAspectRatio
            >
              <img
                src={product.artwork.blob}
                alt=""
                style={{ opacity: isDrag ? 0 : 1 }}
                draggable={false}
              />
            </Rnd>
          </div>
          {/* Dragable */}
          <div
            className={`absolute flex items-center justify-center`}
            style={{
              top: product.y,
              left: product.x,
              width: product.printAreaWidth,
              height: product.printAreaHeight,
            }}
          >
            <Rnd
              ref={rndDraggableRef}
              disableDragging={false}
              enableResizing={true}
              default={{
                x: product.artwork.x,
                y: product.artwork.y,
                width: product.artwork.width,
                height: product.artwork.height,
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
                if (rndPreviewRef.current) {
                  const newProduct = {
                    ...product,
                  };
                  newProduct.artwork = {
                    ...product.artwork,
                    x: data.lastX,
                    y: data.lastY,
                  };
                  setProduct(newProduct);
                }
                // setIsDrag(false);
                setTimeout(() => setIsDrag(false), 100);
              }}
              onResizeStop={(e, dir, eRef, delta, pos) => {
                if (rndDraggableRef.current && rndPreviewRef.current) {
                  const position =
                    rndDraggableRef.current.getDraggablePosition();

                  const newProduct = { ...product };
                  newProduct.artwork = {
                    ...product.artwork,
                    height: parseFloat(eRef.style.height),
                    width: parseFloat(eRef.style.width),
                    x: position.x,
                    y: position.y,
                  };
                  setProduct(newProduct);
                }
                setTimeout(() => setIsDrag(false), 100);
              }}
              className={isShowComponent ? "border border-gray-200" : ""}
            >
              <img
                src={product.artwork?.blob}
                alt=""
                style={{ opacity: isDrag ? 1 : 0 }}
                ref={ref}
                onClick={() => setIsShowComponent(true)}
                draggable={false}
              />
            </Rnd>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
