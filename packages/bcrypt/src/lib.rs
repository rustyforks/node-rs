#[macro_use]
extern crate napi_rs as napi;
#[macro_use]
extern crate napi_rs_derive;

use crate::lib_bcrypt::{format_salt, gen_salt, hash, Version};
use napi::{Buffer, CallContext, Env, Error, JsString, Number, Object, Result, Status, Value};
use std::convert::TryInto;
use std::str::FromStr;

#[cfg(unix)]
#[global_allocator]
static ALLOC: jemallocator::Jemalloc = jemallocator::Jemalloc;

mod b64;
mod bcrypt;
mod errors;
mod lib_bcrypt;

register_module!(test_module, init);

fn init<'env>(
  env: &'env Env,
  exports: &'env mut Value<'env, Object>,
) -> Result<Option<Value<'env, Object>>> {
  exports.set_property(
    env.create_string("hash")?,
    env.create_function("hash", js_hash)?,
  )?;
  exports.set_property(
    env.create_string("genSalt")?,
    env.create_function("genSalt", js_salt)?,
  )?;
  Ok(None)
}

#[js_function(2)]
fn js_salt(ctx: CallContext) -> Result<Value<JsString>> {
  let round = ctx.get::<Number>(0)?;
  let version = ctx.get::<JsString>(1)?;
  let salt = gen_salt();
  let salt_string = format_salt(
    round.try_into()?,
    Version::from_str(version.as_str()?).map_err(|_| Error::new(Status::InvalidArg))?,
    &salt,
  );
  ctx.env.create_string(&salt_string)
}

#[js_function(2)]
fn js_hash(ctx: CallContext) -> Result<Value<JsString>> {
  let password = ctx.get::<Buffer>(0)?;
  let cost = ctx.get::<Number>(1)?;
  let result = hash(&password, cost.try_into()?).map_err(|_| Error::new(Status::GenericFailure))?;
  ctx.env.create_string(result.as_str())
}
