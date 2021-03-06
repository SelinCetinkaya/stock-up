import { useEffect } from "react";
import axios from "axios";
import { baseURL, config } from "../services";
import { Checkbox, List } from "antd";

function ShoppingCart({
  itemsInCart,
  setItemsInCart,
  setShoppingListData,
  shoppingListData,
}) {
  useEffect(() => {
    const getItemsInCart = async () => {
      const response = await axios.get(
        `${baseURL}/stock-up?filterByFormula=%7BisInCart%7D+%3D+1`,
        config
      );
      setItemsInCart(response.data.records);
    };
    getItemsInCart();
  }, [setItemsInCart]);

  async function onChange(e) {
    const item = e.target.value;
    removeFromCart(item);
    addToData(item);
    const newItem = { fields: { ...item.fields, isInCart: 0 } };
    await axios.put(`${baseURL}/stock-up/${item.id}`, newItem, config);
  }

  const removeFromCart = (item) => {
    const index = itemsInCart.indexOf(item);
    let newItems = [...itemsInCart];
    newItems.splice(index, 1);
    setItemsInCart(newItems);
  };

  const addToData = (item) => {
    const category = item.fields.category;
    const items = shoppingListData[category] || [];
    setShoppingListData({ ...shoppingListData, [category]: [...items, item] });
  };

  return (
    <div>
      <List
        className="unordered-list"
        itemLayout="horizontal"
        dataSource={itemsInCart}
        renderItem={(item) => (
          <List.Item className="list-item">
            <Checkbox onChange={onChange} checked value={item} key={item.id}>
              <span className="list-item-title">{item.fields.title}</span>
              <br />
              <span className="list-item-brand-notes">
                {item.fields.brand}
                <br />
                {item.fields.notes}
              </span>
            </Checkbox>
          </List.Item>
        )}
      />
    </div>
  );
}

export default ShoppingCart;
