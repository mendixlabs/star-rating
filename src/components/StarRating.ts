import { CSSProperties, Component, createElement } from "react";
import * as Rating from "react-rating";
import { StarSize, WidgetColors } from "./StarRatingContainer";

import "../ui/StarRating.scss";

export interface StarRatingProps {
    initialRate: number;
    handleOnChange?: (rate: number) => void;
    readOnly: boolean;
    maximumStars: number;
    starSize: StarSize;
    starSizeCustom: number;
    widgetColor: WidgetColors;
}

export class StarRating extends Component<StarRatingProps, {}> {
    private start: number;
    private step: number;
    private stop: number;
    private fractions: number;

    constructor(props: StarRatingProps) {
        super(props);

        this.start = 0;
        this.step = 1;
        this.stop = this.props.maximumStars;
        this.onChange = this.onChange.bind(this);
    }

    render() {
        const { readOnly } = this.props;
        // Read only allows to show half stars, editable only, whole stars.
        this.fractions = readOnly ? 2 : 1;
        this.stop = this.props.maximumStars;

        const customStyle: CSSProperties = this.props.starSize === "custom"
            ? { fontSize: `${this.props.starSizeCustom}px` }
            : {};
        const emptyStar = createElement("span", {
            className: `glyphicon glyphicon-star-empty widget-star-rating-empty ` +
                `widget-star-rating-font-${this.props.starSize}`,
            style: customStyle
        });
        const fullStar = createElement("span", {
            className: `glyphicon glyphicon-star widget-star-rating-font-${this.props.starSize} ` +
            `widget-star-rating-full-${this.props.widgetColor}`,
            style: customStyle
        });

        return createElement(Rating, {
            empty: emptyStar,
            fractions: this.fractions,
            full: fullStar,
            initialRate: this.getRate(this.props),
            onChange: !readOnly ? this.onChange : undefined,
            readonly: readOnly,
            start: this.start,
            step: this.step,
            stop: this.stop
        });
    }

    private getRate(props: StarRatingProps) {
        const maximumValue = this.step * this.stop;
        if (props.initialRate > maximumValue) {
            return maximumValue;
        } else if (props.initialRate < this.start) {
            return this.start;
        }
        // This helps to round off to the nearest fraction.
        // eg fraction 2 or 0.5, rounds off a rate 1.4 to 1.5, 1.2 to 1.0
        return Math.round(props.initialRate * this.fractions) / this.fractions as number;
    }

    private onChange(rate: number) {
        if (this.props.handleOnChange) {
            // Number(rate < 1 ? 1 : rate) deals with library bugs of passing 0 rates.
            this.props.handleOnChange(Number(rate < 1 ? 1 : rate));
        }
    }
}
