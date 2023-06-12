import { after, before, describe, it } from "node:test";
import { strictEqual, deepStrictEqual } from "node:assert";
import { DistinctArgs } from "../interfaces/generics";
import { CreateItemArgs, ItemField } from "../interfaces";
import api from "./utils";

let board_id = 123;
let group_id = "123";

describe("Item API", () => {
  before(async () => {
    const responseBoard = await api.board.createBoard(
      { board_name: "board_name", board_kind: "share" },
      ["id"]
    );
    board_id = Number(responseBoard.id);
    const responseGroup = await api.group.createGroup(
      { board_id, group_name: "group_name" },
      ["id"]
    );
    group_id = responseGroup.id;
  });

  after(async () => {
    await api.board.removeBoard(board_id, ["id"]);
  });

  it("createItem", async () => {
    const item_name = "test";
    const args: CreateItemArgs = {
      board_id,
      group_id,
      item_name,
    };
    const keys = ["id", "name", "state"] satisfies DistinctArgs<ItemField>;
    const response = await api.item.createItem(args, keys, {});
    deepStrictEqual(Object.keys(response), keys);
    strictEqual(response.name, item_name);
  });

  it("listItemsByBoard", async () => {
    const keys = ["id", "name"] satisfies DistinctArgs<ItemField>;
    const response = await api.item.listItemsByBoard(board_id, keys);
    // Create a generic item when creating a board
    strictEqual(response.length, 2);
    deepStrictEqual(Object.keys(response[0]), keys);
  });

  it("listItemsByGroup", async () => {
    const keys = ["id", "name"] satisfies DistinctArgs<ItemField>;
    const response = await api.item.listItemsByGroup(board_id, group_id, keys);
    strictEqual(response.length, 1);
    deepStrictEqual(Object.keys(response[0]), keys);
  });
});
