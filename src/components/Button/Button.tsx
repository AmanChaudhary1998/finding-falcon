export const Button = (props: {
  title: string;
  callbackOnClick: () => void;
}) => {
  function triggerOnClick() {
    if (props?.callbackOnClick !== undefined) props?.callbackOnClick();
  }
  return (
    <div>
      <button onClick={triggerOnClick}>{props?.title}</button>
    </div>
  );
};
