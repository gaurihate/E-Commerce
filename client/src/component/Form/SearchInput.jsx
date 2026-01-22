import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data } = await axios.get(
            `/api/v1/product/search/${values.keyword}`
        );

        setValues({ ...values, results: data.products });
        navigate("/search");
    };

    return (
        <form className="d-flex" onSubmit={handleSubmit}>
            <input
                className="form-control"
                value={values.keyword}
                onChange={(e) =>
                    setValues({ ...values, keyword: e.target.value })
                }
            />
            <button className="btn btn-success">Search</button>
        </form>
    );
};

export default SearchInput;
