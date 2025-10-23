import React, { useEffect, useState } from "react";

import * as layout from "../_redux/layoutRedux";
import { connect, shallowEqual, useSelector } from "react-redux";

function TopMenu(props) {
  const [openDrawer, setOpenDrawer] = useState(false);
  let { state } = useSelector(
    (state) => ({
      state: state.layout2,
    }),
    shallowEqual
  );
  let { inbox_state } = useSelector(
    (state) => ({
      inbox_state: state.inbox,
    }),
    shallowEqual
  );

  if (state === undefined) state = {};
  let item_count = 14;
  useEffect(() => {
    if (state.current_category === null && props.items.length > 0) {
      props.handle_variables("current_category", props.items[0]);
    }
  });

  useEffect(() => {
    if (props.items.length > 0) {
      // props.handle_variables('current_category', props.items[0])
    }
  }, [state.menuChangeByAction]);

  let top_menu_items = props.items;
  let inbox_filters = inbox_state.inbox_filters;
  top_menu_items.map((x) => {
    if (x.items !== undefined) {
      x.items.map((y) => {
        inbox_filters = inbox_filters.filter(
          (k) => k.PRO_UID !== y.pro_uid || k.TAS_UID !== y.tas_uid
        );
      });
    }
  });
  let others = {
    descrption: "",
    icon: "fa fa-hand-pointer-o",
    items: inbox_filters.map((x) => {
      return {
        descrption: "",
        icon: "",
        new: "1",
        can_start: 0,
        pro_descrption: "",
        pro_uid: x.PRO_UID,
        // route: "outlook/create/"+x.PRO_UID+"/"+x.TAS_UID,
        route: "",
        route_type: "internal",
        tas_uid: x.TAS_UID,
        title:
          x.APP_PRO_TITLE +
          (x.ITEMS.length === 1 ? "" : "(" + x.ITEMS.length + ")"),
        unread_count: "0",
      };
    }),
    new: "1",
    title: null,
  };

  return (
    <div className={"header-right-container"}>
      {state.not_inbox ? null : (
        <div style={{ display: "flex" }}>
          {top_menu_items.slice(0, item_count).map((x, key) => {
            let total_count = 0;
            if (x.items !== undefined && x.items !== null) {
              x.items.map((x) => {
                total_count += parseInt(x.unread_count);
                return x;
              });
            }
            return (
              <div
                className={
                  "menu-item" + (state.current_category === x ? " active" : "")
                }
                key={key}
                onClick={() => {
                  props.handle_variables("current_category", x);
                  props.handle_variables("isItemsLoaded", false);
                  setOpenDrawer(false);
                }}
              >
                <div className="h-badge bg-color-orange2">{total_count}</div>
                {state.is_sidebar_collapsed === true ? (
                  <i
                    className={
                      (x.icon === undefined ? "fal fa-briefcase" : x.icon) +
                      " fa-2x"
                    }
                  ></i>
                ) : (
                  <>
                    <i
                      className={
                        (x.icon === undefined ? "fal fa-briefcase" : x.icon) +
                        " fa-2x"
                      }
                    ></i>
                    <div className={"small-text"}>{x.title}</div>
                  </>
                )}
              </div>
            );
          })}

          {top_menu_items.length <= item_count ? null : (
            <>
              <div
                className={"menu-item"}
                onClick={() => {
                  setOpenDrawer(!openDrawer);
                }}
              >
                <i className="fas fa-ellipsis-h fa-2x"></i>
                <div className={"small-text"}>موارد بیشتر</div>
              </div>
              {!openDrawer ? null : (
                <div className={"p-relative"}>
                  <div className={"top-menu-drawer"}>
                    {top_menu_items.slice(item_count).map((x, key) => {
                      return (
                        <div
                          className={
                            "menu-item" +
                            (state.current_category === x ? " active" : "")
                          }
                          key={key}
                          onClick={() => {
                            props.handle_variables("current_category", x);
                            props.handle_variables("isItemsLoaded", false);
                            setOpenDrawer(false);
                          }}
                        >
                          {x.items === undefined ? (
                            <div className="h-badge bg-color-orange2">0</div>
                          ) : (
                            <div className="h-badge bg-color-orange2">
                              {x.items.length}
                            </div>
                          )}
                          {state.is_sidebar_collapsed === true ? (
                            <i
                              className={
                                (x.icon === undefined
                                  ? "fal fa-briefcase"
                                  : x.icon) + " fa-2x"
                              }
                            ></i>
                          ) : (
                            <>
                              <i
                                className={
                                  (x.icon === undefined
                                    ? "fal fa-briefcase"
                                    : x.icon) + " fa-2x"
                                }
                              ></i>
                              <div className={"small-text"}>{x.title}</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default connect(null, layout.actions)(TopMenu);
