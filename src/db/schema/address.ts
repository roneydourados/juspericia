import {
  pgTable,
  varchar,
  integer,
  index,
  serial,
  char,
} from "drizzle-orm/pg-core";

const address = pgTable(
  "address",
  {
    id: serial("id").primaryKey().notNull(),
    ownerId: integer("owner_id").notNull(),
    addressCategory: varchar("address_category", { length: 30 }).notNull(),
    addressZipcode: varchar("address_zipcode", { length: 20 }),
    addressCity: varchar("address_city", { length: 100 }),
    addressDistrict: varchar("address_district", { length: 100 }),
    addressStreet: varchar("address_street", { length: 100 }),
    addressNumber: varchar("address_number", { length: 10 }),
    addressState: char("address_state", { length: 2 }),
    addressComplement: varchar("address_complement", { length: 100 }),
  },
  (table) => {
    return {
      idxAddressCategory: index("address_idx_address_category").using(
        "btree",
        table.addressCategory.asc().nullsLast()
      ),
      idxAddressCity: index("address_idx_address_city").using(
        "btree",
        table.addressCity.asc().nullsLast()
      ),
      idxAddressState: index("address_idx_address_state").using(
        "btree",
        table.addressState.asc().nullsLast()
      ),
      idxOwnerId: index("address_idx_owner_id").using(
        "btree",
        table.ownerId.asc().nullsLast()
      ),
    };
  }
);

export default address;
