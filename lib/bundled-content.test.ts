import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { getAllPosts, getPostBySlug } from "./blog";
import { getForgeProducts, getForgeFunnels, getForgeBuilderProducts } from "./digital-forge";

test("Workers content fallback preserves published posts, products and funnels", async () => {
  const posts = getAllPosts();
  const products = await getForgeProducts();
  const funnels = await getForgeFunnels();
  const builder = await getForgeBuilderProducts();
  const exists = fs.existsSync;
  fs.existsSync = (file) => String(file).includes("content") ? false : exists(file);
  try {
    assert.deepEqual(getAllPosts(), posts);
    assert.deepEqual(getPostBySlug(posts[0].slug), posts[0]);
    assert.equal(getPostBySlug("unknown-post"), null);
    assert.deepEqual(await getForgeProducts(), products);
    assert.deepEqual(await getForgeFunnels(), funnels);
    assert.deepEqual(await getForgeBuilderProducts(), builder);
  } finally { fs.existsSync = exists; }
});
