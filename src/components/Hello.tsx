import React from "react";
import styles from "./styles.module.css";

type Props = {
  name?: string
};

export function Hello({ name = "World" }: Props) {
  return(
    <div>
      <h1 className={styles.blue}>
        Hello, {name}!
      </h1>
    </div>
  );
} 